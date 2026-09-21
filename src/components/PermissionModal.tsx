import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Mail, Zap, Trash2, 
  Lock, CheckCircle2, XCircle, ArrowRight, ShieldAlert, Sparkles 
} from 'lucide-react';
import { UserAccount } from '../types';
import { UserAvatar } from './UserAvatar';
import { triggerHapticFeedback } from '../utils/haptics';

interface PermissionModalProps {
  isOpen: boolean;
  user: UserAccount;
  onAllow: () => void;
  onDeny: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  user,
  onAllow,
  onDeny,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<'allow' | 'deny' | null>(null);

  if (!isOpen) return null;

  const handleAllowClick = () => {
    setActionType('allow');
    setIsProcessing(true);
    triggerHapticFeedback('success');
    setTimeout(() => {
      setIsProcessing(false);
      onAllow();
    }, 600);
  };

  const handleDenyClick = () => {
    setActionType('deny');
    setIsProcessing(true);
    triggerHapticFeedback('light');
    setTimeout(() => {
      setIsProcessing(false);
      onDeny();
    }, 300);
  };

  return (
    <div 
      id="permission-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="permission-modal-container"
        className="bg-white dark:bg-[#16181E] border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto text-stone-900 dark:text-stone-100"
      >
        {/* Top Banner */}
        <div className="bg-linear-to-r from-[#0F6E4F]/10 via-[#0F6E4F]/5 to-transparent dark:from-[#0F6E4F]/20 dark:via-[#0F6E4F]/10 px-6 pt-6 pb-4 border-b border-stone-100 dark:border-stone-800 flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0F6E4F] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0F6E4F]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#0F6E4F]/15 text-[#0F6E4F] dark:text-[#34D399] mb-1">
              Required Permission
            </span>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug">
              Allow Brumy to Access Your Email Account?
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              We ask for permission before starting to work. If access is granted, we will connect to your inbox to detect subscriptions and clean unwanted mail.
            </p>
          </div>
        </div>

        {/* User Account Verification Pill */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <div className="flex items-center space-x-3 min-w-0">
              <UserAvatar
                email={user.email}
                name={user.name}
                photoUrl={user.photoUrl}
                size="md"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
              Pending Access
            </span>
          </div>
        </div>

        {/* Permissions Requested Breakdown */}
        <div className="px-6 py-3 space-y-2.5">
          <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Permissions Brumy is requesting:
          </p>

          {/* Scope 1 */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Read Email Headers &amp; Subscription Metadata
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                Allows Brumy to analyze senders, identify newsletters, promotional blasts, and detect automated unsubscribe links.
              </p>
            </div>
          </div>

          {/* Scope 2 */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Send One-Click Unsubscribe Requests
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                Enables Brumy to transmit standard RFC-8058 one-click unsubscribe instructions to remove you from mailing lists.
              </p>
            </div>
          </div>

          {/* Scope 3 */}
          <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-start space-x-3">
            <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Move Unwanted Subscription Mail to Trash
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                Safely sweeps unwanted emails directly into your email account's Trash folder whenever you choose to clean up.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="px-6 py-2">
          <div className="p-2.5 rounded-xl bg-[#0F6E4F]/5 dark:bg-[#0F6E4F]/10 border border-[#0F6E4F]/20 flex items-center space-x-2 text-[11px] text-[#0F6E4F] dark:text-[#34D399]">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Zero email body storage. You can revoke access at any time in Settings.</span>
          </div>
        </div>

        {/* Action Controls: Deny vs Allow */}
        <div className="p-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            id="permission-deny-btn"
            disabled={isProcessing}
            onClick={handleDenyClick}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-stone-200 dark:border-stone-700 transition-colors disabled:opacity-50"
          >
            {isProcessing && actionType === 'deny' ? 'Denying...' : 'Deny Permission'}
          </button>

          <button
            type="button"
            id="permission-allow-btn"
            disabled={isProcessing}
            onClick={handleAllowClick}
            className="px-6 py-2.5 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] active:scale-[0.99] text-white text-xs font-bold shadow-md shadow-[#0F6E4F]/25 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isProcessing && actionType === 'allow' ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting to Email...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Allow Access</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
