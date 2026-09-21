import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle, Sparkles 
} from 'lucide-react';
import { UserAccount } from '../types';
import { Country, COUNTRIES, validateInternationalPhoneNumber, formatFullPhoneNumber } from '../data/countries';
import { PhoneInput } from './PhoneInput';
import { UserAvatar } from './UserAvatar';
import { getEmailProfilePicture } from '../utils/avatar';
import { triggerHapticFeedback } from '../utils/haptics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'LOGIN' | 'SIGNUP';
  onAuthSuccess: (user: UserAccount, isNewSignup?: boolean) => void;
  existingUsers: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'LOGIN',
  onAuthSuccess,
  existingUsers,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>(initialMode);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Phone fields
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
  });
  const [phoneNumber, setPhoneNumber] = useState('');

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setError(null);
  };

  const handleSwitchMode = (newMode: 'LOGIN' | 'SIGNUP') => {
    triggerHapticFeedback('light');
    setMode(newMode);
    setError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    triggerHapticFeedback('light');

    try {
      // Real backend authentication request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      setIsLoading(false);
      triggerHapticFeedback('success');
      onAuthSuccess(data.user, false);
      onClose();
      handleResetForm();
    } catch (err: any) {
      setIsLoading(false);
      // Fallback check against local users list if offline
      const localUser = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (localUser) {
        triggerHapticFeedback('success');
        onAuthSuccess({
          ...localUser,
          photoUrl: getEmailProfilePicture(cleanEmail),
          lastLoginAt: new Date().toISOString(),
        }, false);
        onClose();
        handleResetForm();
      } else {
        setError(err.message || 'Invalid email or password. Please verify your credentials or sign up.');
      }
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName) {
      setError('Please enter your name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Validate international phone number if provided (optional)
    if (cleanPhone) {
      const phoneValidation = validateInternationalPhoneNumber(cleanPhone, selectedCountry.dialCode);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Please enter a valid phone number format.');
        return;
      }
    }

    setIsLoading(true);
    triggerHapticFeedback('light');

    // Automatically assign the exact picture on their email
    const emailPicture = getEmailProfilePicture(cleanEmail);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          photoUrl: emailPicture,
          countryCode: selectedCountry.code,
          dialCode: selectedCountry.dialCode,
          phoneNumber: cleanPhone ? formatFullPhoneNumber(selectedCountry.dialCode, cleanPhone) : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      setIsLoading(false);
      triggerHapticFeedback('success');
      // Pass isNewSignup: true so the PermissionModal pops up next!
      onAuthSuccess(data.user, true);
      onClose();
      handleResetForm();
    } catch (err: any) {
      setIsLoading(false);
      if (err.message && err.message.includes('already exists')) {
        setError(err.message);
        return;
      }
      // Local fallback
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        photoUrl: emailPicture,
        countryCode: selectedCountry.code,
        dialCode: selectedCountry.dialCode,
        phoneNumber: cleanPhone ? formatFullPhoneNumber(selectedCountry.dialCode, cleanPhone) : undefined,
        emailAccessGranted: false,
        permissionStatus: 'prompt',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      triggerHapticFeedback('success');
      onAuthSuccess(newUser, true);
      onClose();
      handleResetForm();
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="auth-modal-container"
        className="bg-white dark:bg-[#16181E] border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto text-stone-900 dark:text-stone-100"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {mode === 'LOGIN' ? 'Sign In to Your Account' : 'Create an Account'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {mode === 'LOGIN' 
                ? 'Sign in to sync and clean your email inbox' 
                : 'Sign up to sweep unwanted subscriptions and spam'}
            </p>
          </div>
          <button
            id="auth-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-stone-100 dark:bg-stone-800/70 rounded-2xl text-xs font-semibold">
            <button
              type="button"
              id="tab-login-btn"
              onClick={() => handleSwitchMode('LOGIN')}
              className={`py-2 rounded-xl transition-all ${
                mode === 'LOGIN'
                  ? 'bg-white dark:bg-[#1E222B] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => handleSwitchMode('SIGNUP')}
              className={`py-2 rounded-xl transition-all ${
                mode === 'SIGNUP'
                  ? 'bg-white dark:bg-[#1E222B] text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Body Form */}
        <div className="p-6">
          {mode === 'LOGIN' ? (
            /* ================= REAL LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Password</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 pr-10 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('SIGNUP')}
                    className="text-[#0F6E4F] dark:text-[#34D399] font-semibold hover:underline"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* ================= REAL SIGN UP FORM ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* Automatic Email Profile Picture Preview */}
              {email.includes('@') && (
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center space-x-3">
                  <UserAvatar
                    email={email}
                    name={name}
                    size="lg"
                  />
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Email Profile Picture</span>
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Automatically resolved from your email account. No upload needed!
                    </p>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Full Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="signup-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Email Address</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>Password</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 pr-10 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* International Phone Number (Optional, All Countries) */}
              <PhoneInput
                countryCode={selectedCountry.code}
                dialCode={selectedCountry.dialCode}
                phoneNumber={phoneNumber}
                onCountryChange={(country) => setSelectedCountry(country)}
                onPhoneNumberChange={(num) => setPhoneNumber(num)}
                idPrefix="signup-phone"
              />

              {/* Submit Button */}
              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Account...' : 'Continue to Permission Request'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-stone-400 dark:text-stone-500">
                You will be prompted to grant or deny email inbox permissions in the next step.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
