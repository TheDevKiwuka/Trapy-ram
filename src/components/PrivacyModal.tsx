import React from 'react';
import { X, Shield, Lock, Trash2, Key, Check } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRevokeAccess: () => void;
  onDeleteAccount: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onRevokeAccess,
  onDeleteAccount,
}) => {
  if (!isOpen) return null;

  return (
    <div id="privacy-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#16181E] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 dark:border-stone-800 relative text-stone-900 dark:text-stone-100 animate-in fade-in zoom-in duration-150 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-stone-900 dark:text-stone-100">Privacy &amp; Security Controls</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">Strict Data Protection • User data stays private</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Statements */}
        <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Zero Data Storage &amp; No Resale</span>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Brumy never stores your email contents permanently, never sells or shares user data, and strictly adheres to Google API Limited Use specifications.</p>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">PII Minimization Active</span>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Credit cards, phone numbers, and sensitive identifiers are automatically protected from exposure.</p>
            </div>
          </div>
        </div>

        {/* User Account Controls */}
        <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Account Management</h3>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              id="revoke-access-btn"
              onClick={() => {
                onRevokeAccess();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Revoke Gmail Tokens</span>
            </button>

            <button
              id="delete-account-btn"
              onClick={() => {
                onDeleteAccount();
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Brumy Account</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-stone-400 dark:text-stone-500 text-center">
          Brumy is an independent cleanup tool and is not affiliated with Google or Gmail.
        </div>
      </div>
    </div>
  );
};
