import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InboxCleanup } from './components/InboxCleanup';
import { ActivityTrashView } from './components/ActivityTrashView';
import { SettingsView } from './components/SettingsView';
import { ThreadDrawer } from './components/ThreadDrawer';
import { PaywallModal } from './components/PaywallModal';
import { ActionLogsModal } from './components/ActionLogsModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { PermissionModal } from './components/PermissionModal';
import { SplashScreen } from './components/SplashScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { NotificationCenter } from './components/NotificationCenter';
import { INITIAL_SAMPLE_SENDERS, INITIAL_SAMPLE_MESSAGES } from './data/sampleInbox';
import { BrumyMode, Sender, ActionLog, UserAccount, NotificationItem, NotificationPreferences, NotificationChannel } from './types';
import { 
  fetchNotifications, 
  markNotificationRead, 
  clearNotificationsStore, 
  dispatchNotification,
  requestNativePushPermission 
} from './services/notificationService';
import { 
  triggerHapticFeedback, 
  isHapticsEnabledInStorage, 
  setHapticsEnabledInStorage 
} from './utils/haptics';

const DEFAULT_USER: UserAccount = {
  id: 'user-001',
  name: 'ankopest',
  email: 'ankopest@gmail.com',
  photoUrl: 'https://unavatar.io/ankopest%40gmail.com?fallback=https%3A%2F%2Fwww.gravatar.com%2Favatar%2F3b3be63a4c2a439b013787725dfce802%3Fd%3Didenticon',
  countryCode: 'US',
  dialCode: '+1',
  phoneNumber: '+1 (555) 019-2834',
  emailAccessGranted: true,
  permissionStatus: 'granted',
  createdAt: '2026-01-15T08:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<BrumyMode>('INBOX_CLEANUP');
  const [senders, setSenders] = useState<Sender[]>(INITIAL_SAMPLE_SENDERS);
  const [sampleMessages] = useState(INITIAL_SAMPLE_MESSAGES);
  const [unsubCount, setUnsubCount] = useState<number>(4);
  const maxFreeUnsubs = 10;

  // User Accounts State & Persistence
  const [users, setUsers] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brumy_users');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [DEFAULT_USER];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brumy_current_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return DEFAULT_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  // Sync users list to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('brumy_users', JSON.stringify(users));
    }
  }, [users]);

  // Sync current user to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('brumy_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('brumy_current_user');
      }
    }
  }, [currentUser]);

  const [selectedSenderForAI, setSelectedSenderForAI] = useState<Sender | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isActionLogsOpen, setIsActionLogsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const skip = localStorage.getItem('brumy_skip_splash');
      return skip !== 'true';
    }
    return true;
  });

  // Notifications Service State (Push, SMS, In-App)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brumy_notification_prefs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      pushEnabled: true,
      pushPermission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
      pushOnSweepComplete: true,
      pushOnNewClutter: true,
      smsEnabled: true,
      smsPhoneNumber: '+1 (555) 019-2834',
      smsCriticalAlerts: true,
      smsWeeklyDigest: true,
      inAppBanner: true,
      inAppSound: true,
      inAppBadge: true,
    };
  });

  // Sync notification preferences to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('brumy_notification_prefs', JSON.stringify(notificationPreferences));
    }
  }, [notificationPreferences]);

  // Load and refresh notifications from server
  const refreshNotifications = async () => {
    try {
      const list = await fetchNotifications();
      setNotifications(list);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const handleMarkNotificationRead = async (id?: string, all?: boolean) => {
    try {
      const updated = await markNotificationRead(id, all);
      setNotifications(updated);
    } catch {
      setNotifications(prev => prev.map(n => (!id || n.id === id ? { ...n, read: true } : n)));
    }
  };

  const handleClearNotifications = async (id?: string, all?: boolean) => {
    try {
      const updated = await clearNotificationsStore(id, all);
      setNotifications(updated);
    } catch {
      setNotifications(prev => (all ? [] : prev.filter(n => n.id !== id)));
    }
  };

  const handleSendTestNotification = async (channel: NotificationChannel) => {
    let title = '';
    let message = '';
    if (channel === 'push') {
      title = 'Sweep Complete (Push)';
      message = 'Inbox sweep finished: 12 newsletters queued for 1-click unsubscribe.';
    } else if (channel === 'sms') {
      title = 'Brumy Clutter Alert (SMS)';
      message = `[Brumy] Weekly digest for ${currentUser?.name || 'User'}: 48 promotional senders cleaned.`;
    } else {
      title = 'Mailbox Scanned (In-App)';
      message = 'RFC 8058 one-click headers verified for active senders.';
    }

    try {
      await dispatchNotification({
        userId: currentUser?.id,
        type: channel,
        title,
        message,
        phone: currentUser?.phoneNumber || notificationPreferences.smsPhoneNumber,
        soundEnabled: notificationPreferences.inAppSound,
      });
      await refreshNotifications();
      showToast(`${channel.toUpperCase()} notification dispatched successfully!`);
    } catch (err: any) {
      showToast(`Error dispatching ${channel}: ${err.message}`);
    }
  };

  const handleReplaySplash = () => {
    triggerHapticFeedback('light');
    setShowSplash(true);
  };

  const handleOpenSignUpScreen = () => {
    triggerHapticFeedback('light');
    setCurrentMode('SIGNUP');
  };

  // Haptic feedback preference state
  const [isHapticsEnabled, setIsHapticsEnabled] = useState<boolean>(() => isHapticsEnabledInStorage());

  const handleToggleHaptics = () => {
    setIsHapticsEnabled(prev => {
      const next = !prev;
      setHapticsEnabledInStorage(next);
      if (next) {
        triggerHapticFeedback('light', true);
        showToast('Haptic feedback enabled.');
      } else {
        showToast('Haptic feedback disabled.');
      }
      return next;
    });
  };

  // Dark Mode Theme State with local storage persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('brumy_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    return false;
  });

  // Keep document element class aligned with theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('brumy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('brumy_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      showToast(next ? 'Dark mode enabled.' : 'Light mode enabled.');
      return next;
    });
  };

  // Connected Account state
  const [isAccountConnected, setIsAccountConnected] = useState<boolean>(true);

  // Action Audit Trail
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: 'log-01',
      userId: 'user-demo',
      action: 'ai_classify',
      target: 'news@dailytechdigest.com',
      status: 'success',
      details: 'Identified as weekly newsletter',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'log-02',
      userId: 'user-demo',
      action: 'unsubscribe',
      target: 'deals@fashionoutlet24.com',
      status: 'success',
      details: 'Unsubscribed with 1 click',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'log-03',
      userId: 'user-demo',
      action: 'unsubscribe',
      target: 'newsletter@cloudcomputingtoday.io',
      status: 'success',
      details: 'Unsubscribed with 1 click',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Single sender unsubscribe handler
  const handleUnsubscribe = (sender: Sender) => {
    triggerHapticFeedback('unsubscribe');

    if (unsubCount >= maxFreeUnsubs) {
      setIsPaywallOpen(true);
      return;
    }

    const nextCount = unsubCount + 1;
    setUnsubCount(nextCount);

    setSenders(prev =>
      prev.map(s => (s.id === sender.id ? { ...s, unsubscribed: true } : s))
    );

    const logEntry: ActionLog = {
      id: `log-${Date.now()}`,
      userId: 'user-demo',
      action: 'unsubscribe',
      target: sender.email,
      status: 'success',
      details: `Unsubscribed from ${sender.name}`,
      timestamp: new Date().toISOString(),
    };

    setActionLogs(prev => [logEntry, ...prev]);
    showToast(`Unsubscribed from ${sender.name}`);

    if (nextCount >= maxFreeUnsubs) {
      setTimeout(() => setIsPaywallOpen(true), 800);
    }
  };

  // Batch unsubscribe
  const handleBatchUnsubscribe = (selectedList: Sender[]) => {
    triggerHapticFeedback('unsubscribe');

    const unsubscribable = selectedList.filter(s => !s.unsubscribed && s.unsubscribeMethod !== 'none');
    if (unsubscribable.length === 0) {
      showToast('Selected senders are already unsubscribed.');
      return;
    }

    const availableSlots = Math.max(0, maxFreeUnsubs - unsubCount);
    const toProcess = unsubscribable.slice(0, availableSlots);

    if (toProcess.length === 0) {
      setIsPaywallOpen(true);
      return;
    }

    const toProcessIds = new Set(toProcess.map(s => s.id));
    setSenders(prev =>
      prev.map(s => (toProcessIds.has(s.id) ? { ...s, unsubscribed: true } : s))
    );

    setUnsubCount(prev => prev + toProcess.length);

    const newLogs: ActionLog[] = toProcess.map(s => ({
      id: `log-${Date.now()}-${s.id}`,
      userId: 'user-demo',
      action: 'unsubscribe',
      target: s.email,
      status: 'success',
      details: `Batch unsubscribed from ${s.name}`,
      timestamp: new Date().toISOString(),
    }));

    setActionLogs(prev => [...newLogs, ...prev]);
    showToast(`Unsubscribed from ${toProcess.length} senders.`);

    if (unsubscribable.length > availableSlots) {
      setTimeout(() => setIsPaywallOpen(true), 1000);
    }
  };

  // Single sender bulk trash
  const handleBulkTrash = (sender: Sender) => {
    triggerHapticFeedback('trash');

    setSenders(prev =>
      prev.map(s => (s.id === sender.id ? { ...s, trashed: true } : s))
    );

    const logEntry: ActionLog = {
      id: `log-${Date.now()}`,
      userId: 'user-demo',
      action: 'bulk_trash',
      target: sender.email,
      status: 'success',
      details: `Moved ${sender.messageCount} emails to Gmail Trash folder (recoverable for 30 days)`,
      timestamp: new Date().toISOString(),
    };

    setActionLogs(prev => [logEntry, ...prev]);
    showToast(`Moved ${sender.messageCount} emails from ${sender.name} to Trash.`);
  };

  // Batch trash ("Trash all")
  const handleBatchTrash = (selectedList: Sender[]) => {
    triggerHapticFeedback('trash_all');

    const toTrash = selectedList.filter(s => !s.trashed);
    if (toTrash.length === 0) {
      showToast('Selected senders are already in Trash.');
      return;
    }

    const toTrashIds = new Set(toTrash.map(s => s.id));
    setSenders(prev =>
      prev.map(s => (toTrashIds.has(s.id) ? { ...s, trashed: true } : s))
    );

    const totalEmails = toTrash.reduce((acc, s) => acc + s.messageCount, 0);

    const newLogs: ActionLog[] = toTrash.map(s => ({
      id: `log-${Date.now()}-${s.id}`,
      userId: 'user-demo',
      action: 'bulk_trash',
      target: s.email,
      status: 'success',
      details: `Batch moved ${s.messageCount} emails to Gmail Trash`,
      timestamp: new Date().toISOString(),
    }));

    setActionLogs(prev => [...newLogs, ...prev]);
    showToast(`Moved ${totalEmails} emails across ${toTrash.length} senders to Trash.`);
  };

  // Restore sender from Trash back to active inbox
  const handleRestoreSender = (sender: Sender) => {
    setSenders(prev =>
      prev.map(s => (s.id === sender.id ? { ...s, trashed: false } : s))
    );

    const logEntry: ActionLog = {
      id: `log-${Date.now()}`,
      userId: 'user-demo',
      action: 'bulk_trash',
      target: sender.email,
      status: 'success',
      details: `Restored ${sender.messageCount} emails from Gmail Trash back to active inbox`,
      timestamp: new Date().toISOString(),
    };

    setActionLogs(prev => [logEntry, ...prev]);
    showToast(`Restored ${sender.messageCount} emails from ${sender.name} to Inbox.`);
  };

  // Whitelist toggle
  const handleToggleWhitelist = (sender: Sender) => {
    const nextState = !sender.whitelisted;
    setSenders(prev =>
      prev.map(s => (s.id === sender.id ? { ...s, whitelisted: nextState } : s))
    );
    showToast(nextState ? `Whitelisted ${sender.name} (safe from cleanup).` : `Removed ${sender.name} from whitelist.`);
  };

  // Rescan simulation
  const handleRescanInbox = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      showToast('Inbox refreshed: 1,000 messages checked.');
    }, 1000);
  };

  const handleDisconnectAccount = () => {
    setIsAccountConnected(false);
    showToast('Gmail account ankopest@gmail.com disconnected. Access revoked.');
  };

  const handleReconnectAccount = () => {
    setIsAccountConnected(true);
    showToast('Reconnected to ankopest@gmail.com.');
  };

  const handleDeleteAllData = () => {
    setSenders(INITIAL_SAMPLE_SENDERS);
    setUnsubCount(0);
    setActionLogs([]);
    showToast('Inbox reset to starting sample data.');
  };

  // User Account Handlers
  const handleAuthSuccess = (user: UserAccount, isNewSignup?: boolean) => {
    setCurrentUser(user);
    setUsers(prev => {
      const filtered = prev.filter(u => u.email.toLowerCase() !== user.email.toLowerCase());
      return [user, ...filtered];
    });

    if (isNewSignup) {
      showToast(`Account created for ${user.name}!`);
      // Ask for permission before starting to work
      setIsPermissionModalOpen(true);
    } else {
      showToast(`Welcome back, ${user.name}! Signed in successfully.`);
      // If user hasn't explicitly allowed or denied permission yet, show the pop up
      if (user.emailAccessGranted === false && user.permissionStatus === 'prompt') {
        setIsPermissionModalOpen(true);
      }
    }
  };

  const handleAllowPermission = async () => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      emailAccessGranted: true,
      permissionStatus: 'granted',
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setIsAccountConnected(true);
    setIsPermissionModalOpen(false);

    // Call server to persist permissions
    try {
      await fetch('/api/auth/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, granted: true, permissionStatus: 'granted' }),
      });
    } catch {
      // client-side state is already updated
    }

    showToast('Permission granted! Brumy connected to your email account.');
    // As requested: "is access granted we access there email account"
    handleRescanInbox();
  };

  const handleDenyPermission = async () => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      emailAccessGranted: false,
      permissionStatus: 'denied',
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
    setIsPermissionModalOpen(false);

    try {
      await fetch('/api/auth/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, granted: false, permissionStatus: 'denied' }),
      });
    } catch {
      // client-side state is already updated
    }

    showToast('Permission denied. Email account access restricted.');
  };

  const handleRevokePermission = async () => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      emailAccessGranted: false,
      permissionStatus: 'denied',
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));

    try {
      await fetch('/api/auth/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: updated.id, granted: false, permissionStatus: 'denied' }),
      });
    } catch {
      // client-side state is already updated
    }

    showToast('Email account access revoked.');
  };

  const handleSaveProfile = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    showToast('Profile updated successfully.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of account.');
  };

  const handleOpenAuth = (mode: 'LOGIN' | 'SIGNUP' = 'LOGIN') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenEditProfile = () => {
    if (currentUser) {
      setIsEditProfileModalOpen(true);
    } else {
      handleOpenAuth('LOGIN');
    }
  };

  const trashedCount = senders.filter(s => s.trashed).length;

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => setShowSplash(false)}
        onSkip={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#FAFAF9] dark:bg-[#0E1116] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900 dark:selection:bg-emerald-950 dark:selection:text-emerald-200 transition-colors duration-200">
      {/* Web App Header */}
      <Header
        currentMode={currentMode}
        onModeChange={(mode) => setCurrentMode(mode)}
        unsubCount={unsubCount}
        maxFreeUnsubs={maxFreeUnsubs}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenActionLogs={() => setIsActionLogsOpen(true)}
        activeSendersCount={senders.filter(s => !s.trashed).length}
        trashedCount={trashedCount}
        actionLogsCount={actionLogs.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isAccountConnected={isAccountConnected}
        onDisconnectAccount={handleDisconnectAccount}
        onReconnectAccount={handleReconnectAccount}
        onResetAllowance={() => {
          setUnsubCount(0);
          showToast('Free allowance reset to 0/10.');
        }}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenEditProfile={handleOpenEditProfile}
        onLogout={handleLogout}
        onRequestPermission={() => setIsPermissionModalOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.read).length}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        onOpenSignUpScreen={handleOpenSignUpScreen}
        onReplaySplash={handleReplaySplash}
      />

      {/* Main Web App Views */}
      <main className="flex-1 pb-24 md:pb-16 w-full max-w-full overflow-x-hidden">
        {currentMode === 'SIGNUP' && (
          <div className="py-6 px-4 max-w-5xl mx-auto animate-in fade-in duration-200">
            <SignUpScreen
              initialMode="SIGNUP"
              onAuthSuccess={(user, isNew, prefs) => {
                if (prefs) {
                  setNotificationPreferences(prev => ({
                    ...prev,
                    pushEnabled: prefs.pushEnabled,
                    smsEnabled: prefs.smsEnabled,
                    inAppBanner: prefs.inAppBanner,
                    inAppSound: prefs.inAppBanner,
                  }));
                }
                handleAuthSuccess(user, isNew);
                setCurrentMode('INBOX_CLEANUP');
              }}
              onCancel={() => setCurrentMode('INBOX_CLEANUP')}
            />
          </div>
        )}

        {currentMode === 'INBOX_CLEANUP' && (
          <InboxCleanup
            senders={senders}
            onUnsubscribe={handleUnsubscribe}
            onBulkTrash={handleBulkTrash}
            onBatchUnsubscribe={handleBatchUnsubscribe}
            onBatchTrash={handleBatchTrash}
            onToggleWhitelist={handleToggleWhitelist}
            onSelectSenderForAI={(sender) => setSelectedSenderForAI(sender)}
            onRescanInbox={handleRescanInbox}
            isScanning={isScanning}
            unsubCount={unsubCount}
            maxFreeUnsubs={maxFreeUnsubs}
            currentUser={currentUser}
            onRequestPermission={() => setIsPermissionModalOpen(true)}
          />
        )}

        {currentMode === 'ACTIVITY_TRASH' && (
          <ActivityTrashView
            senders={senders}
            actionLogs={actionLogs}
            onRestoreSender={handleRestoreSender}
          />
        )}

        {currentMode === 'SETTINGS' && (
          <SettingsView
            unsubCount={unsubCount}
            maxFreeUnsubs={maxFreeUnsubs}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onResetAllowance={() => {
              setUnsubCount(0);
              showToast('Free allowance reset to 0/10 for testing.');
            }}
            onDisconnectAccount={handleDisconnectAccount}
            onDeleteAllData={handleDeleteAllData}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
            isAccountConnected={isAccountConnected}
            onReconnectAccount={handleReconnectAccount}
            isHapticsEnabled={isHapticsEnabled}
            onToggleHaptics={handleToggleHaptics}
            currentUser={currentUser}
            onOpenEditProfile={handleOpenEditProfile}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onRequestPermission={() => setIsPermissionModalOpen(true)}
            onRevokePermission={handleRevokePermission}
            notificationPreferences={notificationPreferences}
            onUpdateNotificationPreferences={(updated) => {
              setNotificationPreferences(prev => ({ ...prev, ...updated }));
              showToast('Notification preferences updated.');
            }}
            onNotificationDispatched={refreshNotifications}
            onReplaySplash={handleReplaySplash}
          />
        )}
      </main>

      {/* Multi-Channel Notification Center Drawer */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onClear={handleClearNotifications}
        onSendTestNotification={handleSendTestNotification}
        onOpenSettings={() => {
          setIsNotificationCenterOpen(false);
          setCurrentMode('SETTINGS');
        }}
      />

      {/* Thread Drawer for Assistant */}
      {selectedSenderForAI && (
        <ThreadDrawer
          sender={selectedSenderForAI}
          sampleMessages={sampleMessages}
          onClose={() => setSelectedSenderForAI(null)}
          onUnsubscribe={handleUnsubscribe}
          onBulkTrash={handleBulkTrash}
        />
      )}

      {/* Paywall & Plan Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        unsubCount={unsubCount}
        onResetFreeCount={() => {
          setUnsubCount(0);
          showToast('Free allowance reset to 0/10.');
        }}
      />

      {/* Audit Logs & Action Trail Modal */}
      <ActionLogsModal
        isOpen={isActionLogsOpen}
        onClose={() => setIsActionLogsOpen(false)}
        logs={actionLogs}
        onClearLogs={() => {
          setActionLogs([]);
          showToast('Audit trail cleared.');
        }}
      />

      {/* Privacy & Security Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        onRevokeAccess={handleDisconnectAccount}
        onDeleteAccount={handleDeleteAllData}
      />

      {/* User Accounts Authentication Modal (Login & Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        existingUsers={users}
      />

      {/* User Profile Edit Modal (Name, Global Phone, Email avatar) */}
      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          user={currentUser}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {/* Permission Consent Modal (Allow or Deny Email Access) */}
      {currentUser && (
        <PermissionModal
          isOpen={isPermissionModalOpen}
          user={currentUser}
          onAllow={handleAllowPermission}
          onDeny={handleDenyPermission}
        />
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in slide-in-from-bottom duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
