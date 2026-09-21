import React, { useState } from 'react';
import { X, Check, Zap, CheckCircle2 } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  unsubCount: number;
  onResetFreeCount: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  unsubCount,
  onResetFreeCount,
}) => {
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  return (
    <div id="paywall-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#171A21] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 dark:border-stone-800 relative animate-in fade-in zoom-in duration-150 transition-colors">
        <button
          id="close-paywall-btn"
          onClick={() => {
            setUpgraded(false);
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {upgraded ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0F6E4F] text-white flex items-center justify-center shadow-md">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Welcome to Brumy Pro!</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Your account now has unlimited 1-click unsubscriptions and automatic background cleanups.
              </p>
            </div>
            <button
              onClick={() => {
                setUpgraded(false);
                onResetFreeCount();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-[#0F6E4F] hover:bg-[#0c593f] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Continue Cleaning
            </button>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2 mb-6">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0F6E4F]/10 dark:bg-[#0F6E4F]/20 text-[#0F6E4F] dark:text-[#34D399] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Free Allowance</span>
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">Brumy Pro Unlimited</h2>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  You&apos;ve used {unsubCount} of 10 free unsubscriptions. Upgrade to clean up your entire inbox without limits.
                </p>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-2xl p-4 mb-6">
              <div className="flex items-baseline justify-between mb-3 pb-3 border-b border-stone-200 dark:border-stone-700">
                <div>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-100">Unlimited Cleaning</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">Cancel anytime</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-stone-900 dark:text-stone-100">$7</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">/month</span>
                </div>
              </div>

              <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-2">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399] shrink-0" />
                  <span>Unlimited 1-click unsubscriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399] shrink-0" />
                  <span>Bulk-trash clutter with 30-day restore guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#0F6E4F] dark:text-[#34D399] shrink-0" />
                  <span>Instant thread summaries &amp; quick reply drafts</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                id="upgrade-pro-btn"
                onClick={() => {
                  setUpgraded(true);
                }}
                className="w-full py-2.5 px-4 bg-[#0F6E4F] hover:bg-[#0c593f] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-emerald-200" />
                <span>Upgrade to Pro ($7/mo)</span>
              </button>

              <button
                id="reset-demo-count-btn"
                onClick={() => {
                  onResetFreeCount();
                  onClose();
                }}
                className="w-full py-2 px-4 text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                Reset Free Test Allowance (0/10)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
