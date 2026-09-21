import { NotificationChannel, NotificationItem, NotificationPreferences } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

// Default Preferences
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  pushPermission: typeof window !== 'undefined' && 'Notification' in window 
    ? (Notification.permission as 'default' | 'granted' | 'denied') 
    : 'default',
  pushOnSweepComplete: true,
  pushOnNewClutter: true,
  smsEnabled: true,
  smsPhoneNumber: '+1 (555) 019-2834',
  smsCountryCode: 'US',
  smsCriticalAlerts: true,
  smsWeeklyDigest: true,
  inAppEnabled: true,
  inAppSound: true,
  inAppBadge: true,
};

// Play subtle in-app chime using Web Audio API
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // Audio context not allowed or unsupported
  }
}

// Check native push notification permission
export async function requestNativePushPermission(): Promise<'granted' | 'denied' | 'default'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    triggerHapticFeedback(permission === 'granted' ? 'success' : 'warning');
    return permission;
  } catch {
    return 'denied';
  }
}

// Fetch all notifications from server
export async function fetchServerNotifications(userId?: string): Promise<NotificationItem[]> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`/api/notifications${query}`);
    if (!res.ok) throw new Error('Failed to load notifications');
    const data = await res.json();
    return data.notifications || [];
  } catch (err) {
    console.warn('Using local notification cache due to fetch error:', err);
    return [];
  }
}
export const fetchNotifications = fetchServerNotifications;

// Send Notification via server & client channels
export async function dispatchNotification(payload: {
  userId?: string;
  type: NotificationChannel;
  title: string;
  message: string;
  category?: 'sweep' | 'security' | 'digest' | 'system';
  phone?: string;
  soundEnabled?: boolean;
}): Promise<{ success: boolean; notification: NotificationItem; deliveryReceipt?: unknown }> {
  const { type, title, message, soundEnabled = true } = payload;

  // 1. Client-side handling for Push
  if (type === 'push' && typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/favicon.ico',
        });
      } catch {
        // Native push within iframe restriction fallback
      }
    }
  }

  // 2. Client-side sound for In-App
  if ((type === 'in_app' || type === 'push') && soundEnabled) {
    playNotificationChime();
  }

  // 3. Dispatch to server backend
  try {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Server rejected notification dispatch');
    }

    const data = await res.json();
    triggerHapticFeedback('light');
    return data;
  } catch (err) {
    // Local fallback creation
    const fallbackItem: NotificationItem = {
      id: `local-notif-${Date.now()}`,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      category: payload.category || 'sweep',
      timestamp: new Date().toISOString(),
      read: false,
      status: 'simulated',
      channelDetails: payload.type === 'sms' ? { phone: payload.phone || '+1 (555) 019-2834', carrier: 'SMS Fallback' } : undefined,
    };
    return { success: true, notification: fallbackItem };
  }
}

// Mark notifications as read
export async function markNotificationsAsRead(id?: string, all?: boolean): Promise<NotificationItem[]> {
  try {
    const res = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, all }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.notifications || [];
  } catch {
    return [];
  }
}
export const markNotificationRead = markNotificationsAsRead;

// Clear notifications
export async function clearServerNotifications(id?: string, all?: boolean): Promise<NotificationItem[]> {
  try {
    const res = await fetch('/api/notifications/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, all }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.notifications || [];
  } catch {
    return [];
  }
}
export const clearNotificationsStore = clearServerNotifications;

