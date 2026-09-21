import React, { useState } from 'react';
import { 
  Bell, Smartphone, Mail, ShieldCheck, CheckCircle2, 
  Send, AlertCircle, Sparkles, Volume2, VolumeX, Phone,
  RefreshCw, Check, Info
} from 'lucide-react';
import { NotificationPreferences, NotificationChannel, UserAccount } from '../types';
import { requestNativePushPermission, dispatchNotification } from '../services/notificationService';
import { triggerHapticFeedback } from '../utils/haptics';

interface NotificationSettingsCardProps {
  preferences: NotificationPreferences;
  onUpdatePreferences: (updated: Partial<NotificationPreferences>) => void;
  currentUser?: UserAccount | null;
  onOpenEditProfile?: () => void;
  onNotificationDispatched?: () => void;
  onReplaySplash?: () => void;
}

export const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  preferences,
  onUpdatePreferences,
  currentUser,
  onOpenEditProfile,
  onNotificationDispatched,
  onReplaySplash,
}) => {
  const [testingChannel, setTestingChannel] = useState<NotificationChannel | null>(null);
  const [testResult, setTestResult] = useState<{
    channel: NotificationChannel;
    message: string;
    details?: string;
  } | null>(null);

  const handleRequestPush = async () => {
    triggerHapticFeedback('light');
    const result = await requestNativePushPermission();
    onUpdatePreferences({ pushPermission: result, pushEnabled: result === 'granted' });
  };

  const handleTestNotification = async (channel: NotificationChannel) => {
    setTestingChannel(channel);
    setTestResult(null);
    triggerHapticFeedback('light');

    let title = '';
    let message = '';

    if (channel === 'push') {
      title = 'Brumy Push Notification';
      message = 'Inbox sweep completed. 14 newsletters were queued for 1-click unsubscribe.';
    } else if (channel === 'sms') {
      title = 'Brumy SMS Alert';
      message = `[Brumy] Clutter digest ready for ${currentUser?.name || 'User'}: 48 promotional senders detected.`;
    } else {
      title = 'Brumy In-App Alert';
      message = 'Mailbox scan active: RFC 8058 1-click headers verified.';
    }

    try {
      const res = await dispatchNotification({
        userId: currentUser?.id,
        type: channel,
        title,
        message,
        phone: currentUser?.phoneNumber || preferences.smsPhoneNumber,
        soundEnabled: preferences.inAppSound,
      });

      onNotificationDispatched?.();

      let details = '';
      if (channel === 'sms') {
        const phone = currentUser?.phoneNumber || preferences.smsPhoneNumber;
        details = `Delivered via Tier-1 SMS Gateway to ${phone}`;
      } else if (channel === 'push') {
        details = preferences.pushPermission === 'granted' 
          ? 'Dispatched to your browser Web Push notification center'
          : 'Dispatched via server push queue';
      } else {
        details = 'In-app notification badge updated and sound played';
      }

      setTestResult({
        channel,
        message: `Successfully tested ${channel.toUpperCase()} notification!`,
        details,
      });
    } catch (err: any) {
      setTestResult({
        channel,
        message: `Failed to test ${channel}: ${err.message}`,
      });
    } finally {
      setTestingChannel(null);
    }
  };

  const currentPhone = currentUser?.phoneNumber || preferences.smsPhoneNumber || 'Not configured';

  return (
    <div id="notification-settings-card" className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-6 transition-colors">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#0F6E4F] dark:text-emerald-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Notification Service Configuration
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Configure multi-channel alerts across Web Push, SMS, and In-App notifications.
            </p>
          </div>
        </div>

        {onReplaySplash && (
          <button
            id="replay-splash-btn"
            onClick={onReplaySplash}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F6E4F]" />
            <span>Replay Splash Screen</span>
          </button>
        )}
      </div>

      {/* Test feedback banner */}
      {testResult && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">{testResult.message}</span>
            {testResult.details && <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">{testResult.details}</p>}
          </div>
        </div>
      )}

      {/* 3 Channel Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. PUSH CHANNEL */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  Push Notifications
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                preferences.pushPermission === 'granted'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : preferences.pushPermission === 'denied'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}>
                {preferences.pushPermission}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Browser push alerts when background sweeps finish or when new high-frequency senders arrive.
            </p>

            {preferences.pushPermission !== 'granted' && (
              <button
                id="request-push-perm-btn"
                onClick={handleRequestPush}
                className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Request Push Permission</span>
              </button>
            )}

            {/* Toggles */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px]">Sweep completion alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.pushOnSweepComplete}
                  onChange={(e) => onUpdatePreferences({ pushOnSweepComplete: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px]">Clutter surge warning</span>
                <input
                  type="checkbox"
                  checked={preferences.pushOnNewClutter}
                  onChange={(e) => onUpdatePreferences({ pushOnNewClutter: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => handleTestNotification('push')}
            disabled={testingChannel === 'push'}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>{testingChannel === 'push' ? 'Testing Push...' : 'Send Test Push'}</span>
          </button>
        </div>

        {/* 2. SMS CHANNEL */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  SMS Notifications
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                Tier-1 Telco
              </span>
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
              <p>Direct mobile SMS alerts and summaries dispatched to your verified number.</p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-stone-800 dark:text-stone-200 font-semibold truncate">
                  {currentPhone}
                </span>
                {onOpenEditProfile && (
                  <button
                    onClick={onOpenEditProfile}
                    className="text-[10px] font-semibold text-[#0F6E4F] hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px]">Critical security alerts</span>
                <input
                  type="checkbox"
                  checked={preferences.smsCriticalAlerts}
                  onChange={(e) => onUpdatePreferences({ smsCriticalAlerts: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px]">Weekly clutter digest via SMS</span>
                <input
                  type="checkbox"
                  checked={preferences.smsWeeklyDigest}
                  onChange={(e) => onUpdatePreferences({ smsWeeklyDigest: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => handleTestNotification('sms')}
            disabled={testingChannel === 'sms'}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-purple-600" />
            <span>{testingChannel === 'sms' ? 'Testing SMS...' : 'Send Test SMS'}</span>
          </button>
        </div>

        {/* 3. IN-APP CHANNEL */}
        <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-850/60 border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                  In-App Notifications
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                Active Tray
              </span>
            </div>

            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
              Floating badge indicators in the header navigation, audit toasts, and interactive notification center.
            </p>

            {/* Toggles */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px]">Show unread badge</span>
                <input
                  type="checkbox"
                  checked={preferences.inAppBadge}
                  onChange={(e) => onUpdatePreferences({ inAppBadge: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <span className="text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1">
                  {preferences.inAppSound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3 text-stone-400" />}
                  <span>Notification sound tone</span>
                </span>
                <input
                  type="checkbox"
                  checked={preferences.inAppSound}
                  onChange={(e) => onUpdatePreferences({ inAppSound: e.target.checked })}
                  className="w-3.5 h-3.5 rounded text-[#0F6E4F] focus:ring-0"
                />
              </label>
            </div>
          </div>

          <button
            onClick={() => handleTestNotification('in_app')}
            disabled={testingChannel === 'in_app'}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>{testingChannel === 'in_app' ? 'Testing In-App...' : 'Trigger In-App Chime'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
