import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Trash2, Settings, Zap, BrushCleaning, 
  LogOut, Clock, Shield, ChevronDown, 
  RefreshCw, CheckCircle2, User, Phone, LogIn, UserPlus, ShieldAlert, ShieldCheck,
  Bell, Sparkles, Smartphone
} from 'lucide-react';
import { BrumyMode, UserAccount } from '../types';
import { UserAvatar } from './UserAvatar';
import { triggerHapticFeedback } from '../utils/haptics';

interface HeaderProps {
  currentMode: BrumyMode;
  onModeChange: (mode: BrumyMode) => void;
  unsubCount: number;
  maxFreeUnsubs: number;
  onOpenPaywall: () => void;
  onOpenPrivacy?: () => void;
  onOpenActionLogs?: () => void;
  activeSendersCount?: number;
  trashedCount?: number;
  actionLogsCount?: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  isAccountConnected?: boolean;
  onDisconnectAccount?: () => void;
  onReconnectAccount?: () => void;
  onResetAllowance?: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: (mode: 'LOGIN' | 'SIGNUP') => void;
  onOpenEditProfile?: () => void;
  onLogout?: () => void;
  onRequestPermission?: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
  onOpenSignUpScreen?: () => void;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  unsubCount,
  maxFreeUnsubs,
  onOpenPaywall,
  onOpenPrivacy,
  onOpenActionLogs,
  activeSendersCount = 0,
  trashedCount = 0,
  actionLogsCount = 0,
  isDarkMode,
  onToggleDarkMode,
  isAccountConnected = true,
  onDisconnectAccount,
  onReconnectAccount,
  onResetAllowance,
  currentUser,
  onOpenAuth,
  onOpenEditProfile,
  onLogout,
  onRequestPermission,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onOpenSignUpScreen,
  onReplaySplash,
}) => {
  const remaining = Math.max(0, maxFreeUnsubs - unsubCount);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  const handleNavClick = (mode: BrumyMode) => {
    triggerHapticFeedback('light');
    onModeChange(mode);
  };

  const handleActionLogClick = () => {
    triggerHapticFeedback('light');
    onOpenActionLogs?.();
  };

  const handlePrivacyClick = () => {
    triggerHapticFeedback('light');
    onOpenPrivacy?.();
  };

  return (
    <>
      {/* Primary Navigation Bar (Sticky Top) */}
      <header 
        id="brumy-header" 
        className="sticky top-0 z-30 bg-white/95 dark:bg-[#16181E]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors duration-200"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            
            {/* Left: Brand Logo & Operational Status */}
            <div className="flex items-center space-x-3 shrink-0">
              <button
                id="brand-home-btn"
                onClick={() => handleNavClick('INBOX_CLEANUP')}
                className="flex items-center space-x-2.5 text-left group transition-transform active:scale-95 shrink-0 focus:outline-none"
                aria-label="Brumy Home"
              >
                <div className="w-9 h-9 rounded-xl bg-[#0F6E4F] flex items-center justify-center text-white shadow-xs group-hover:bg-[#0c593f] transition-colors shrink-0">
                  <BrushCleaning className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base tracking-tight text-stone-900 dark:text-stone-100">
                      Brumy
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium hidden sm:inline-block -mt-0.5">
                    Gmail One-Click Cleanup
                  </span>
                </div>
              </button>
            </div>

            {/* Center: Desktop Navigation Bar Tabs */}
            <nav 
              id="web-app-nav" 
              className="hidden md:flex items-center space-x-1 bg-stone-100/90 dark:bg-stone-800/80 p-1 rounded-xl border border-stone-200/70 dark:border-stone-700/60 text-xs font-medium shrink-0"
              aria-label="Main Navigation"
            >
              {/* Clean Inbox Tab */}
              <button
                id="nav-tab-cleanup"
                onClick={() => handleNavClick('INBOX_CLEANUP')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  currentMode === 'INBOX_CLEANUP'
                    ? 'bg-white dark:bg-[#1E222B] text-stone-900 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Mail className={`w-3.5 h-3.5 ${currentMode === 'INBOX_CLEANUP' ? 'text-[#0F6E4F]' : 'text-stone-500'} shrink-0`} />
                <span>Clean Inbox</span>
                {activeSendersCount > 0 && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                    currentMode === 'INBOX_CLEANUP'
                      ? 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                      : 'bg-stone-200/80 dark:bg-stone-750 text-stone-600 dark:text-stone-400'
                  }`}>
                    {activeSendersCount}
                  </span>
                )}
              </button>

              {/* Trash & Undo Tab */}
              <button
                id="nav-tab-activity"
                onClick={() => handleNavClick('ACTIVITY_TRASH')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  currentMode === 'ACTIVITY_TRASH'
                    ? 'bg-white dark:bg-[#1E222B] text-stone-900 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Trash2 className={`w-3.5 h-3.5 ${currentMode === 'ACTIVITY_TRASH' ? 'text-rose-600' : 'text-stone-500'} shrink-0`} />
                <span>Trash &amp; Undo</span>
                {trashedCount > 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold leading-tight">
                    {trashedCount}
                  </span>
                )}
              </button>

              {/* Audit Logs Quick Tab */}
              {onOpenActionLogs && (
                <button
                  id="nav-tab-logs"
                  onClick={handleActionLogClick}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                  title="View Audit Trail &amp; Action Logs"
                >
                  <Clock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Audit Trail</span>
                  {actionLogsCount > 0 && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold leading-tight">
                      {actionLogsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Settings Tab */}
              <button
                id="nav-tab-settings"
                onClick={() => handleNavClick('SETTINGS')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  currentMode === 'SETTINGS'
                    ? 'bg-white dark:bg-[#1E222B] text-stone-900 dark:text-white shadow-xs font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Settings className={`w-3.5 h-3.5 ${currentMode === 'SETTINGS' ? 'text-[#0F6E4F]' : 'text-stone-500'} shrink-0`} />
                <span>Settings</span>
              </button>
            </nav>

            {/* Right Action Bar: Allowance, Privacy, Theme & Account */}
            <div className="flex items-center space-x-2 shrink-0">
              
              {/* Free Allowance Pill */}
              <button
                id="free-limit-pill"
                onClick={onOpenPaywall}
                className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800/90 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700 transition-colors text-xs whitespace-nowrap shrink-0 group"
                title="Click to view upgrade plans"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-stone-700 dark:text-stone-300 font-medium">
                  <strong className="text-stone-900 dark:text-stone-100 font-semibold">{remaining}</strong>
                  <span className="hidden sm:inline"> left</span>
                </span>
                <span className="hidden lg:inline text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                  Upgrade
                </span>
              </button>

              {/* Privacy & Security Quick Trigger (Desktop & Mobile) */}
              {onOpenPrivacy && (
                <button
                  id="nav-privacy-btn"
                  onClick={handlePrivacyClick}
                  className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 transition-colors shrink-0"
                  title="Privacy &amp; Security Controls"
                  aria-label="Open Privacy Settings"
                >
                  <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                </button>
              )}

              {/* Multi-Channel Notification Service Center Bell */}
              {onOpenNotifications && (
                <button
                  id="nav-notifications-btn"
                  onClick={() => {
                    triggerHapticFeedback('light');
                    onOpenNotifications();
                  }}
                  className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 transition-colors shrink-0"
                  title="Notification Service (Push, SMS, In-App)"
                  aria-label="Open Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  {unreadNotificationsCount > 0 && (
                    <span 
                      id="header-notification-badge"
                      className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs animate-in zoom-in"
                    >
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Account Profile Menu with Dropdown / Auth Triggers */}
              <div className="relative shrink-0" ref={accountMenuRef}>
                {currentUser ? (
                  <button
                    id="nav-account-dropdown-btn"
                    onClick={() => setIsAccountMenuOpen(prev => !prev)}
                    className="flex items-center space-x-1.5 p-1 sm:px-2 py-1 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200 dark:border-stone-700 transition-colors text-left"
                    title="Account & profile settings"
                    aria-expanded={isAccountMenuOpen}
                  >
                    <UserAvatar
                      email={currentUser.email}
                      name={currentUser.name}
                      photoUrl={currentUser.photoUrl}
                      size="sm"
                    />
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 max-w-[90px] sm:max-w-[110px] truncate hidden md:inline">
                      {currentUser.name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''} hidden sm:inline`} />
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      id="header-signin-btn"
                      onClick={() => onOpenSignUpScreen ? onOpenSignUpScreen() : onOpenAuth?.('LOGIN')}
                      className="px-2.5 py-1.5 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      id="header-signup-btn"
                      onClick={() => onOpenSignUpScreen ? onOpenSignUpScreen() : onOpenAuth?.('SIGNUP')}
                      className="px-2.5 py-1.5 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}

                {/* Account Dropdown Panel */}
                {isAccountMenuOpen && currentUser && (
                  <div 
                    id="account-menu-dropdown"
                    className="absolute right-0 mt-2 w-76 rounded-2xl bg-white dark:bg-[#1A1D24] border border-stone-200 dark:border-stone-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-100 text-xs text-stone-700 dark:text-stone-300"
                  >
                    {/* User Profile Card Header */}
                    <div className="px-3.5 py-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center space-x-3">
                        <UserAvatar
                          email={currentUser.email}
                          name={currentUser.name}
                          photoUrl={currentUser.photoUrl}
                          size="lg"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-stone-900 dark:text-stone-100 truncate text-sm">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate font-mono">
                            {currentUser.email}
                          </p>
                          {currentUser.phoneNumber ? (
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center space-x-1 truncate">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{currentUser.phoneNumber}</span>
                            </p>
                          ) : (
                            <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                              Phone optional (none added)
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email Access Permission Status Strip */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 dark:text-stone-400">Email Access:</span>
                        {currentUser.emailAccessGranted ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Permission Granted
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountMenuOpen(false);
                              onRequestPermission?.();
                            }}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition-colors"
                          >
                            <ShieldAlert className="w-3 h-3 mr-1 text-amber-600" />
                            Grant Access
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <div className="py-1">
                      {onOpenNotifications && (
                        <button
                          id="menu-notifications-btn"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onOpenNotifications();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center justify-between text-stone-700 dark:text-stone-200 transition-colors font-medium"
                        >
                          <div className="flex items-center space-x-2.5">
                            <Bell className="w-3.5 h-3.5 text-blue-500" />
                            <span>Notifications (Push, SMS, In-App)</span>
                          </div>
                          {unreadNotificationsCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                              {unreadNotificationsCount}
                            </span>
                          )}
                        </button>
                      )}

                      {onOpenEditProfile && (
                        <button
                          id="menu-edit-profile-btn"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onOpenEditProfile();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-700 dark:text-stone-200 transition-colors font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>Edit Profile (Photo, Name, Phone)</span>
                        </button>
                      )}

                      {onReplaySplash && (
                        <button
                          id="menu-replay-splash-btn"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onReplaySplash();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-700 dark:text-stone-200 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Show Splash Screen</span>
                        </button>
                      )}

                      {onOpenActionLogs && (
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onOpenActionLogs();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-700 dark:text-stone-200 transition-colors"
                        >
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Audit Trail ({actionLogsCount})</span>
                        </button>
                      )}

                      {onOpenPrivacy && (
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onOpenPrivacy();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-700 dark:text-stone-200 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-stone-400" />
                          <span>Privacy &amp; Security Controls</span>
                        </button>
                      )}

                      {onResetAllowance && (
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onResetAllowance();
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-600 dark:text-stone-400 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                          <span>Reset Free Allowance ({remaining}/{maxFreeUnsubs})</span>
                        </button>
                      )}

                      <button
                        id="menu-switch-account-btn"
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          if (onOpenSignUpScreen) {
                            onOpenSignUpScreen();
                          } else {
                            onOpenAuth?.('LOGIN');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 flex items-center space-x-2.5 text-stone-600 dark:text-stone-400 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5 text-stone-400" />
                        <span>Sign In / Sign Up Screen</span>
                      </button>
                    </div>

                    {onLogout && (
                      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                        <button
                          id="menu-logout-btn"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2.5 transition-colors font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dedicated Bottom Navigation Bar (Ultra-responsive for mobile viewports) */}
      <nav 
        id="mobile-bottom-nav" 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#16181E]/95 border-t border-stone-200 dark:border-stone-800 backdrop-blur-lg px-3 py-1.5 flex items-center justify-around shadow-lg transition-colors"
        aria-label="Mobile Navigation"
      >
        {/* Clean Inbox Mobile Button */}
        <button
          id="mobile-bottom-clean"
          onClick={() => handleNavClick('INBOX_CLEANUP')}
          className={`relative flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
            currentMode === 'INBOX_CLEANUP'
              ? 'text-[#0F6E4F] dark:text-[#34D399] font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
          aria-label="Clean Inbox View"
        >
          <div className="relative">
            <Mail className={`w-5 h-5 ${currentMode === 'INBOX_CLEANUP' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {activeSendersCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold min-w-[14px] text-center leading-tight">
                {activeSendersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Clean</span>
        </button>

        {/* Trash & Undo Mobile Button */}
        <button
          id="mobile-bottom-trash"
          onClick={() => handleNavClick('ACTIVITY_TRASH')}
          className={`relative flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
            currentMode === 'ACTIVITY_TRASH'
              ? 'text-rose-600 dark:text-rose-400 font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
          aria-label="Trash and Undo View"
        >
          <div className="relative">
            <Trash2 className={`w-5 h-5 ${currentMode === 'ACTIVITY_TRASH' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {trashedCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-rose-600 text-white text-[9px] font-bold min-w-[14px] text-center leading-tight">
                {trashedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Trash</span>
        </button>

        {/* Audit Logs Mobile Button */}
        {onOpenActionLogs && (
          <button
            id="mobile-bottom-logs"
            onClick={handleActionLogClick}
            className="relative flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
            aria-label="Open Audit Logs"
          >
            <div className="relative">
              <Clock className="w-5 h-5 stroke-2" />
              {actionLogsCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 rounded-full bg-stone-700 text-white text-[9px] font-bold min-w-[14px] text-center leading-tight">
                  {actionLogsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Audit</span>
          </button>
        )}

        {/* Settings Mobile Button */}
        <button
          id="mobile-bottom-settings"
          onClick={() => handleNavClick('SETTINGS')}
          className={`relative flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl transition-all ${
            currentMode === 'SETTINGS'
              ? 'text-[#0F6E4F] dark:text-[#34D399] font-bold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
          aria-label="Settings View"
        >
          <Settings className={`w-5 h-5 ${currentMode === 'SETTINGS' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 font-medium">Settings</span>
        </button>
      </nav>
    </>
  );
};
