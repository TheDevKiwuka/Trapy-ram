/**
 * Haptic Feedback Utility using the Browser Vibration API (navigator.vibrate)
 * Provides tactile response for critical user actions like 'Unsubscribe' and 'Trash all'.
 */

export type HapticType = 'unsubscribe' | 'trash' | 'trash_all' | 'light' | 'success' | 'warning';

// Standardized vibration timing patterns (in milliseconds)
// Numbers alternate between vibration duration and pause duration
export const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  // Crisp double pulse when unsubscribing from a sender
  unsubscribe: [50, 30, 60],
  // Deeper dual pulse for moving items to trash
  trash: [60, 40, 70],
  // Distinctive multi-pulse sequence when mass-trashing / "Trash all"
  trash_all: [80, 40, 80, 40, 100],
  // Gentle single tap for selection or micro-interactions
  light: 35,
  // Affirmative confirmation pulse
  success: [40, 50, 40],
  // Warning or alert pulse
  warning: [100, 60, 100],
};

/**
 * Checks if the current browser environment supports the Vibration API
 */
export const isVibrationSupported = (): boolean => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
};

/**
 * Checks if haptics is enabled in user preferences
 */
export const isHapticsEnabledInStorage = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('brumy_haptics_enabled');
  return stored !== 'false'; // Enabled by default
};

/**
 * Sets haptic preference in localStorage
 */
export const setHapticsEnabledInStorage = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('brumy_haptics_enabled', enabled ? 'true' : 'false');
};

let lastTriggerTime = 0;
let lastTriggerType: HapticType | null = null;

/**
 * Triggers haptic feedback via navigator.vibrate
 * @param type The action type: 'unsubscribe' | 'trash' | 'trash_all' | 'light' | 'success' | 'warning'
 * @param force If true, bypasses user preference check (used for test triggers in settings)
 * @returns boolean indicating whether vibration was triggered
 */
export const triggerHapticFeedback = (
  type: HapticType = 'light',
  force = false
): boolean => {
  const now = Date.now();
  // Prevent duplicate vibration triggers for the same action within 80ms
  if (!force && lastTriggerType === type && now - lastTriggerTime < 80) {
    return false;
  }
  lastTriggerTime = now;
  lastTriggerType = type;

  if (!force && !isHapticsEnabledInStorage()) {
    return false;
  }

  const pattern = HAPTIC_PATTERNS[type] ?? 35;

  let vibrationSuccess = false;

  if (isVibrationSupported()) {
    try {
      vibrationSuccess = navigator.vibrate(pattern);
    } catch (e) {
      // Some browsers might throw if permissions or user activation restrictions apply
      console.warn('[Haptics] Browser vibration failed:', e);
    }
  }

  // Dispatch a lightweight custom event so UI components can optionally show visual tactile ripples
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('brumy:haptic-triggered', {
        detail: { type, pattern, vibrationSuccess },
      })
    );
  }

  return vibrationSuccess;
};
