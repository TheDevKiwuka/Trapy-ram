import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, Mail, Zap, AlertTriangle, Moon, Sun, LogOut, RefreshCw, XCircle,
  Smartphone, Activity, User, Phone, Edit3, LogIn, UserPlus, ShieldCheck, ShieldAlert, Sparkles, Bell
} from 'lucide-react';
import { UserAccount, NotificationPreferences } from '../types';
import { UserAvatar } from './UserAvatar';
import { NotificationSettingsCard } from './NotificationSettingsCard';
import { triggerHapticFeedback, isVibrationSupported } from '../utils/haptics';

interface SettingsViewProps {
  unsubCount: number;
  maxFreeUnsubs: number;
  onOpenPaywall: () => void;
  onResetAllowance: () => void;
  onDisconnectAccount: () => void;
  onDeleteAllData: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAccountConnected?: boolean;
  onReconnectAccount?: () => void;
  isHapticsEnabled?: boolean;
  onToggleHaptics?: () => void;
  currentUser?: UserAccount | null;
  onOpenEditProfile?: () => void;
  onOpenAuth?: (mode: 'LOGIN' | 'SIGNUP') => void;
  onLogout?: () => void;
  onRequestPermission?: () => void;
  onRevokePermission?: () => void;
  notificationPreferences: NotificationPreferences;
  onUpdateNotificationPreferences: (updated: Partial<NotificationPreferences>) => void;
  onNotificationDispatched?: () => void;
  onReplaySplash?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  unsubCount,
  maxFreeUnsubs,
  onOpenPaywall,
  onResetAllowance,
  onDisconnectAccount,
  onDeleteAllData,
  isDarkMode,
  onToggleDarkMode,
  isAccountConnected = true,
  onReconnectAccount,
  isHapticsEnabled = true,
  onToggleHaptics,
  currentUser,
  onOpenEditProfile,
  onOpenAuth,
  onLogout,
  onRequestPermission,
  onRevokePermission,
  notificationPreferences,
  onUpdateNotificationPreferences,
  onNotificationDispatched,
  onReplaySplash,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const percentUsed = Math.min(100, Math.round((unsubCount / maxFreeUnsubs) * 100));

  const handleExecuteDisconnect = () => {
    onDisconnectAccount();
    setConfirmDisconnect(false);
  };

  return (
    <div id="settings-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 w-full text-stone-900 dark:text-stone-100">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100">Settings &amp; Preferences</h1>
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Manage your user profile, connected Gmail account, theme appearance, and privacy preferences.
        </p>
      </div>

      {/* 1. User Account & Profile Identity */}
      <div id="user-profile-settings-card" className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Exact email avatar with click to edit name/phone */}
            <div 
              onClick={onOpenEditProfile}
              className="relative cursor-pointer group shrink-0"
              title="Click to edit profile info"
            >
              <UserAvatar
                email={currentUser?.email}
                name={currentUser?.name}
                photoUrl={currentUser?.photoUrl}
                size="xl"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-semibold">
                <Edit3 className="w-4 h-4" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  {currentUser?.name || 'Guest User'}
                </h2>
                {currentUser && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#0F6E4F]/10 dark:bg-[#0F6E4F]/20 text-[#0F6E4F] dark:text-[#34D399] border border-[#0F6E4F]/20">
                    Active Account
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                {currentUser?.email || 'No account logged in'}
              </p>
              
              {/* Phone Display */}
              <div className="flex items-center space-x-1.5 pt-1 text-xs">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {currentUser?.phoneNumber ? (
                  <span className="font-mono text-stone-700 dark:text-stone-300 font-medium">
                    {currentUser.phoneNumber}
                  </span>
                ) : (
                  <span className="text-stone-400 dark:text-stone-500 italic">
                    Phone number optional (none provided)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {currentUser ? (
              <>
                <button
                  id="settings-edit-profile-btn"
                  onClick={onOpenEditProfile}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center space-x-1.5 border border-stone-200 dark:border-stone-700 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  id="settings-logout-btn"
                  onClick={onLogout}
                  className="px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  id="settings-signin-btn"
                  onClick={() => onOpenAuth?.('LOGIN')}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="settings-signup-btn"
                  onClick={() => onOpenAuth?.('SIGNUP')}
                  className="px-4 py-2 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Informational badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Profile Photo</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1">
              Exact picture from email account
            </span>
          </div>
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Global Phone Support</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {currentUser?.phoneNumber ? 'International format set' : 'Optional (All countries)'}
            </span>
          </div>
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Email Access Permission</span>
            <span className={`font-semibold flex items-center gap-1 ${
              currentUser?.emailAccessGranted 
                ? 'text-emerald-700 dark:text-emerald-400' 
                : 'text-amber-700 dark:text-amber-400'
            }`}>
              {currentUser?.emailAccessGranted ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Access Granted
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Permission Required
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Connected Gmail Account & Relocated Quick-Access Disconnect */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-5 transition-colors">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0F6E4F]/10 dark:bg-[#0F6E4F]/25 border border-[#0F6E4F]/20 dark:border-[#0F6E4F]/40 flex items-center justify-center text-[#0F6E4F] dark:text-[#34D399] font-bold text-lg shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {currentUser?.email || 'ankopest@gmail.com'}
                </h2>
                {isAccountConnected && currentUser?.emailAccessGranted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" /> Connected &amp; Granted
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600 dark:text-amber-400" /> Permission Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Explicit permission requested before starting to work or access email accounts.
              </p>
            </div>
          </div>

          {/* Quick status indicator */}
          <div className="flex items-center gap-2">
            {currentUser?.emailAccessGranted ? (
              <button
                onClick={onRevokePermission}
                className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors"
                title="Revoke access to this email account"
              >
                Deny / Revoke Access
              </button>
            ) : (
              <button
                onClick={onRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Allow Access
              </button>
            )}
          </div>
        </div>

        {/* Informational Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Permissions</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">Read senders &amp; manage clutter</span>
          </div>
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Data Privacy</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">No passwords or emails stored</span>
          </div>
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
            <span className="text-stone-400 dark:text-stone-500 block mb-0.5">Account Status</span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {isAccountConnected && currentUser?.emailAccessGranted ? 'Active & Synced' : 'Access Restricted'}
            </span>
          </div>
        </div>

        {/* Relocated, Highly Accessible Disconnect Section */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/70 dark:bg-stone-800/40 p-4 rounded-xl border border-stone-200/70 dark:border-stone-800">
          <div>
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-200 flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              Account Session Management
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isAccountConnected 
                ? "Easily disconnect or switch accounts. Revokes Brumy's active token immediately."
                : "Your account is currently disconnected. Reconnect to resume scanning your inbox."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAccountConnected ? (
              confirmDisconnect ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setConfirmDisconnect(false)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-disconnect-btn"
                    onClick={handleExecuteDisconnect}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Confirm Disconnect
                  </button>
                </div>
              ) : (
                <button
                  id="settings-disconnect-btn"
                  onClick={() => setConfirmDisconnect(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold shadow-xs transition-all"
                  title="Disconnect ankopest@gmail.com"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1 text-rose-600 dark:text-rose-400" />
                  Disconnect Account
                </button>
              )
            ) : (
              <button
                id="settings-reconnect-btn"
                onClick={onReconnectAccount}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs font-semibold shadow-xs transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reconnect Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Multi-Channel Notification Service (Push, SMS, In-App) */}
      <NotificationSettingsCard
        preferences={notificationPreferences}
        onUpdatePreferences={onUpdateNotificationPreferences}
        currentUser={currentUser}
        onOpenEditProfile={onOpenEditProfile}
        onNotificationDispatched={onNotificationDispatched}
        onReplaySplash={onReplaySplash}
      />

      {/* 3. Functional Dark Mode Toggle in Settings */}
      <div id="settings-appearance-card" className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Appearance &amp; Theme</h2>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isDarkMode ? 'bg-indigo-950/70 text-indigo-300 border border-indigo-800/60' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Switch between light mode and eye-friendly dark mode for comfortable reading anytime.
            </p>
          </div>

          {/* Interactive Switch Pill */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>
            <button
              id="theme-switch-toggle"
              onClick={onToggleDarkMode}
              role="switch"
              aria-checked={isDarkMode}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDarkMode ? 'bg-[#0F6E4F]' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <span className="sr-only">Toggle dark mode</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3.5 h-3.5 text-stone-900" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Visual Selectable Theme Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Light Theme Option Card */}
          <button
            id="theme-select-light"
            onClick={() => { if (isDarkMode) onToggleDarkMode(); }}
            className={`p-4 rounded-xl text-left border transition-all ${
              !isDarkMode 
                ? 'border-[#0F6E4F] bg-stone-50 ring-1 ring-[#0F6E4F]/30 dark:bg-stone-800' 
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">Light Mode</span>
              </div>
              {!isDarkMode && (
                <span className="w-2 h-2 rounded-full bg-[#0F6E4F]" />
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Clean warm-neutral background (#FAFAF9) with crisp typography and high contrast readability.
            </p>
          </button>

          {/* Dark Theme Option Card */}
          <button
            id="theme-select-dark"
            onClick={() => { if (!isDarkMode) onToggleDarkMode(); }}
            className={`p-4 rounded-xl text-left border transition-all ${
              isDarkMode 
                ? 'border-[#0F6E4F] bg-stone-800/80 ring-1 ring-[#0F6E4F]/30' 
                : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-950/80 flex items-center justify-center text-indigo-300">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">Dark Mode</span>
              </div>
              {isDarkMode && (
                <span className="w-2 h-2 rounded-full bg-[#0F6E4F]" />
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              Calm twilight canvas (#121417) that softens eye strain in low-light settings.
            </p>
          </button>
        </div>
      </div>

      {/* Tactile Haptic Feedback Card */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Tactile Haptic Feedback</h2>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                isVibrationSupported() 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
              }`}>
                {isVibrationSupported() ? 'Vibration API Supported' : 'Simulated on Desktop'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Provides distinctive physical vibration patterns when clicking <strong className="text-stone-700 dark:text-stone-300">Unsubscribe</strong> and <strong className="text-stone-700 dark:text-stone-300">Trash all</strong> for confirmed tactile reassurance.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {onToggleHaptics && (
              <button
                id="toggle-haptics-btn"
                onClick={onToggleHaptics}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] focus:ring-offset-2 ${
                  isHapticsEnabled ? 'bg-[#0F6E4F]' : 'bg-stone-200 dark:bg-stone-700'
                }`}
                role="switch"
                aria-checked={isHapticsEnabled}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isHapticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Test vibration buttons */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">Test Vibration Responses:</span>
          <button
            id="test-haptic-unsub-btn"
            onClick={() => triggerHapticFeedback('unsubscribe', true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-50 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Unsubscribe Pulse (50ms+60ms)
          </button>
          <button
            id="test-haptic-trash-all-btn"
            onClick={() => triggerHapticFeedback('trash_all', true)}
            className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-50 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-stone-700 dark:text-stone-300 hover:text-rose-700 dark:hover:text-rose-300 border border-stone-200 dark:border-stone-700 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
            Trash All Pattern (Triple pulse)
          </button>
        </div>
      </div>

      {/* 3. Free Plan & Usage */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">Plan Allowance</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                {unsubCount} of {maxFreeUnsubs} used
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              You get {maxFreeUnsubs} free 1-click unsubscriptions on the Free plan.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetAllowance}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-medium text-stone-600 dark:text-stone-300 transition-colors"
              title="Reset counter for testing"
            >
              Reset Allowance
            </button>

            <button
              onClick={onOpenPaywall}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F6E4F] hover:bg-[#0c593f] text-white shadow-xs transition-all"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
              Upgrade to Unlimited ($7/mo)
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentUsed >= 100 ? 'bg-rose-500' : percentUsed >= 70 ? 'bg-amber-500' : 'bg-[#0F6E4F]'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-stone-400 dark:text-stone-500">
            <span>{Math.max(0, maxFreeUnsubs - unsubCount)} free unsubscriptions left</span>
            <span>Brumy Pro gives unlimited unsubscriptions</span>
          </div>
        </div>
      </div>

      {/* 4. Safety & Privacy Guarantees */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center space-x-2.5 text-stone-900 dark:text-stone-100">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-base font-bold">Privacy &amp; Safety Guarantees</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">1-Click Unsubscribe</span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Brumy directly contacts sender systems without redirecting you to annoying external forms or surveys.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">30-Day Safe Recovery</span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Emails are moved to your standard Gmail Trash folder. Nothing is permanently deleted, and you can undo anytime within 30 days.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">Zero Email Storage</span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              We never store your personal email conversations or sell your data. Summaries and drafts are processed in memory and never saved.
            </p>
          </div>

          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1">
            <span className="font-semibold text-stone-900 dark:text-stone-100 block">Revoke Anytime</span>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              You can disconnect Brumy with a single click. Access is immediately revoked with Google.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Danger Zone */}
      <div className="bg-white dark:bg-[#171A21] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center space-x-2 text-stone-900 dark:text-stone-100">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold">Reset Demo Data</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 block">Reset inbox to starting demo state</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Restores all sample senders, clears test history, and resets free unsubscription count.
            </span>
          </div>

          {confirmDelete ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAllData();
                  setConfirmDelete(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Yes, Reset Everything
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors shrink-0"
            >
              Reset Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

