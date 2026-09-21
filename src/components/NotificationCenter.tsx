import React, { useState } from 'react';
import { 
  Bell, Smartphone, Mail, CheckCheck, Trash2, X, 
  ShieldAlert, Sparkles, Send, CheckCircle2, ExternalLink,
  Sliders, ArrowUpRight
} from 'lucide-react';
import { NotificationItem, NotificationChannel } from '../types';
import { triggerHapticFeedback } from '../utils/haptics';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id?: string, all?: boolean) => void;
  onClear: (id?: string, all?: boolean) => void;
  onSendTestNotification: (channel: NotificationChannel) => void;
  onOpenSettings?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClear,
  onSendTestNotification,
  onOpenSettings,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationChannel>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getChannelBadge = (type: NotificationChannel) => {
    switch (type) {
      case 'push':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Bell className="w-2.5 h-2.5 mr-1" /> Push
          </span>
        );
      case 'sms':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Smartphone className="w-2.5 h-2.5 mr-1" /> SMS
          </span>
        );
      case 'in_app':
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Mail className="w-2.5 h-2.5 mr-1" /> In-App
          </span>
        );
    }
  };

  return (
    <div 
      id="notification-center-drawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-[#161920] h-full shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col animate-in slide-in-from-right duration-250 text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm sm:text-base">Notification Service</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Push, SMS &amp; In-App multi-channel alerts
              </p>
            </div>
          </div>

          <button
            id="close-notification-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Test Channel Dispatch Bar */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-850/80 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
            Dispatch Test Alert:
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onSendTestNotification('push')}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-blue-700 dark:text-blue-400 transition-colors flex items-center gap-1"
              title="Trigger browser push alert"
            >
              <Bell className="w-2.5 h-2.5" /> Push
            </button>
            <button
              onClick={() => onSendTestNotification('sms')}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-purple-700 dark:text-purple-400 transition-colors flex items-center gap-1"
              title="Simulate SMS gateway alert"
            >
              <Smartphone className="w-2.5 h-2.5" /> SMS
            </button>
            <button
              onClick={() => onSendTestNotification('in_app')}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-emerald-700 dark:text-emerald-400 transition-colors flex items-center gap-1"
              title="Play audio chime & in-app banner"
            >
              <Mail className="w-2.5 h-2.5" /> In-App
            </button>
          </div>
        </div>

        {/* Filter Pills & Actions */}
        <div className="px-4 py-2 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
            {(['all', 'push', 'sms', 'in_app'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveFilter(tab);
                }}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors ${
                  activeFilter === tab
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {tab === 'in_app' ? 'In-App' : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1 shrink-0 text-xs">
            {unreadCount > 0 && (
              <button
                onClick={() => onMarkAsRead(undefined, true)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => onClear(undefined, true)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100 dark:divide-stone-800/60">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                No notifications in this channel
              </p>
              <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                Sweep alerts, security access updates, and SMS digests will appear here in real-time.
              </p>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`pt-3 first:pt-0 cursor-pointer group transition-all ${
                  !n.read ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div className="p-3 rounded-2xl bg-stone-50/70 hover:bg-stone-100/80 dark:bg-stone-850/50 dark:hover:bg-stone-800 border border-stone-200/60 dark:border-stone-800 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0F6E4F] shrink-0" title="Unread" />
                      )}
                      {getChannelBadge(n.type)}
                      <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                        {n.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pl-4">
                    {n.message}
                  </p>

                  {/* Channel specifics: phone, carrier, SID */}
                  {n.channelDetails && (
                    <div className="pl-4 pt-1 flex flex-wrap items-center gap-2 text-[10px] text-stone-400 font-mono">
                      {n.channelDetails.phone && (
                        <span className="bg-stone-200/70 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                          To: {n.channelDetails.phone}
                        </span>
                      )}
                      {n.channelDetails.carrier && (
                        <span className="bg-stone-200/70 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-500">
                          {n.channelDetails.carrier}
                        </span>
                      )}
                      {n.channelDetails.messageSid && (
                        <span className="text-stone-400">
                          SID: {n.channelDetails.messageSid}
                        </span>
                      )}
                      <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold ml-auto">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                        {n.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Manage Notification Settings Link */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850/60 flex items-center justify-between text-xs">
          <span className="text-stone-500 dark:text-stone-400 text-[11px]">
            Channels: Push • SMS • In-App
          </span>
          {onOpenSettings && (
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="inline-flex items-center font-bold text-[#0F6E4F] hover:text-[#0c593f] dark:text-[#34D399] transition-colors gap-1 text-[11px]"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Channels</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
