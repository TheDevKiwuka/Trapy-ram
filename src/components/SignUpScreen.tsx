import React, { useState } from 'react';
import { 
  BrushCleaning, Mail, Lock, User, Eye, EyeOff, CheckCircle2, 
  ArrowRight, ShieldCheck, AlertCircle, Sparkles, Bell, 
  Smartphone, ArrowLeft, Check, LogIn
} from 'lucide-react';
import { UserAccount, NotificationPreferences } from '../types';
import { Country, COUNTRIES, validateInternationalPhoneNumber, formatFullPhoneNumber } from '../data/countries';
import { PhoneInput } from './PhoneInput';
import { UserAvatar } from './UserAvatar';
import { getEmailProfilePicture } from '../utils/avatar';
import { triggerHapticFeedback } from '../utils/haptics';

interface SignUpScreenProps {
  onBackToApp?: () => void;
  onCancel?: () => void;
  initialMode?: 'SIGNUP' | 'LOGIN';
  onAuthSuccess: (
    user: UserAccount, 
    isNewSignup?: boolean, 
    prefs?: { pushEnabled: boolean; smsEnabled: boolean; inAppBanner: boolean }
  ) => void;
  onOpenLogin?: () => void;
  existingUsers?: UserAccount[];
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBackToApp,
  onCancel,
  initialMode = 'SIGNUP',
  onAuthSuccess,
  onOpenLogin,
  existingUsers = [],
}) => {
  // Screen mode: 'SIGNUP' or 'LOGIN' (inline toggle)
  const [activeTab, setActiveTab] = useState<'SIGNUP' | 'LOGIN'>(initialMode);

  // Sign Up form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone state
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === 'US') || COUNTRIES[0];
  });
  const [phoneNumber, setPhoneNumber] = useState('');

  // Notification opt-ins on signup
  const [optInPush, setOptInPush] = useState(true);
  const [optInSMS, setOptInSMS] = useState(true);
  const [optInInApp, setOptInInApp] = useState(true);

  // Login form fields (if user switches to login tab)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Derived avatar for live preview
  const liveAvatarEmail = activeTab === 'SIGNUP' ? email.trim() : loginEmail.trim();

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-stone-200 dark:bg-stone-700' };
    if (pass.length < 6) return { score: 1, label: 'Too short', color: 'bg-rose-500' };
    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
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

    if (cleanPhone) {
      const phoneValidation = validateInternationalPhoneNumber(cleanPhone, selectedCountry.dialCode);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Please enter a valid phone number format.');
        return;
      }
    }

    setIsLoading(true);
    triggerHapticFeedback('light');

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
          notificationPreferences: {
            pushEnabled: optInPush,
            smsEnabled: optInSMS,
            inAppEnabled: optInInApp,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed. Please check your information.');
      }

      setIsLoading(false);
      triggerHapticFeedback('success');
      // On new signup: triggers PermissionModal immediately!
      onAuthSuccess(data.user, true);
    } catch (err: any) {
      setIsLoading(false);
      // Fallback local registration if offline
      const duplicate = existingUsers.some(u => u.email.toLowerCase() === cleanEmail);
      if (duplicate) {
        setError('An account with this email already exists. Please switch to Sign In.');
        return;
      }

      const localNewUser: UserAccount = {
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
      onAuthSuccess(localNewUser, true, {
        pushEnabled: optInPush,
        smsEnabled: optInSMS,
        inAppBanner: optInInApp,
      });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    triggerHapticFeedback('light');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials. Please verify your email and password.');
      }

      setIsLoading(false);
      triggerHapticFeedback('success');
      onAuthSuccess(data.user, false);
    } catch (err: any) {
      setIsLoading(false);
      const localUser = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (localUser) {
        triggerHapticFeedback('success');
        onAuthSuccess(localUser, false);
      } else {
        setError(err.message || 'Authentication failed. Please verify your credentials or register.');
      }
    }
  };

  return (
    <div id="brumy-signup-screen" className="min-h-screen bg-stone-50 dark:bg-[#111317] text-stone-900 dark:text-stone-100 py-8 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full space-y-6">
        
        {/* Navigation Bar / Return to App */}
        <div className="flex items-center justify-between">
          <button
            id="signup-back-btn"
            onClick={onCancel || onBackToApp}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-white dark:bg-[#181B22] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* Header & Brand with Live Avatar Preview */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-[#0F6E4F] flex items-center justify-center text-white shadow-md shadow-[#0F6E4F]/20">
                <BrushCleaning className="w-5 h-5 text-white" />
              </div>

              {/* Dynamic Live Avatar indicator */}
              <div className="relative">
                <UserAvatar
                  email={liveAvatarEmail || 'preview@example.com'}
                  name={name || 'New User'}
                  size="md"
                />
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {activeTab === 'SIGNUP' ? 'Create Account' : 'Sign In'}
              </h1>
            </div>

            {/* Mode Switcher Pills */}
            <div className="inline-flex p-1 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs font-semibold">
              <button
                type="button"
                id="signup-tab-btn"
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('SIGNUP');
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'SIGNUP'
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-white shadow-xs font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                id="login-tab-btn"
                onClick={() => {
                  triggerHapticFeedback('light');
                  setActiveTab('LOGIN');
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  activeTab === 'LOGIN'
                    ? 'bg-white dark:bg-stone-750 text-stone-900 dark:text-white shadow-xs font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
                }`}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'SIGNUP' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] transition-colors"
                  />
                </div>
              </div>

              {/* Email Address with live avatar hint */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password with strength bar */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {password && (
                  <div className="pt-1 flex items-center space-x-2 text-[10px]">
                    <div className="flex-1 h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden flex space-x-0.5">
                      <div className={`h-full ${strength.color} flex-1`} />
                      <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-stone-300 dark:bg-stone-800'} flex-1`} />
                      <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-stone-300 dark:bg-stone-800'} flex-1`} />
                      <div className={`h-full ${strength.score >= 4 ? strength.color : 'bg-stone-300 dark:bg-stone-800'} flex-1`} />
                    </div>
                    <span className="text-stone-400">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* International Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Phone Number <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <PhoneInput
                  countryCode={selectedCountry.code}
                  dialCode={selectedCountry.dialCode}
                  phoneNumber={phoneNumber}
                  onCountryChange={setSelectedCountry}
                  onPhoneNumberChange={setPhoneNumber}
                  idPrefix="signup-screen"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="signup-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F6E4F]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* SIGN IN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ankopest@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0F6E4F] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="login-submit-btn"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0F6E4F]/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Brumy</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy Footnote */}
          <div className="pt-2 text-center text-[11px] text-stone-400 dark:text-stone-500 space-y-1">
            <p>
              By continuing, you agree to Brumy's Limited-Use Privacy Policy.
            </p>
            <p className="text-[10px]">
              We request explicit permission before accessing email content or sending notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
