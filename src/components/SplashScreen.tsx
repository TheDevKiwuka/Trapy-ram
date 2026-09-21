import React, { useState, useEffect } from 'react';
import { BrushCleaning } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

interface SplashScreenProps {
  onComplete: () => void;
  onSkip?: () => void;
  onOpenSignUp?: () => void;
  isInitialLoad?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  onSkip,
}) => {
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(65), 350);
    const t2 = setTimeout(() => setProgress(100), 750);
    const t3 = setTimeout(() => {
      handleComplete();
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleComplete = () => {
    triggerHapticFeedback('light');
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <div 
      id="brumy-splash-screen"
      onClick={handleComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAFAF9] dark:bg-[#0E1116] text-stone-900 dark:text-stone-100 p-8 select-none transition-colors duration-200 cursor-pointer animate-in fade-in duration-300"
    >
      <div className="w-full flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 px-3 py-1.5 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Centered Android Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-4 my-auto">
        <div className="w-20 h-20 rounded-3xl bg-[#0F6E4F] flex items-center justify-center text-white shadow-lg shadow-[#0F6E4F]/25 transition-transform duration-300 active:scale-95">
          <BrushCleaning className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
            Brumy
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Clean inbox, zero clutter
          </p>
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="w-32 bg-stone-200 dark:bg-stone-800 rounded-full h-1 overflow-hidden mt-6">
          <div 
            className="bg-[#0F6E4F] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="text-[11px] text-stone-400 dark:text-stone-600 font-medium">
        Fast &bull; Private &bull; Secure
      </div>
    </div>
  );
};
