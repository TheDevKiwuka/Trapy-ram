import React, { useState } from 'react';
import { X, User, Phone, Save, AlertCircle, Sparkles, Mail } from 'lucide-react';
import { UserAccount } from '../types';
import { Country, COUNTRIES, validateInternationalPhoneNumber, formatFullPhoneNumber } from '../data/countries';
import { PhoneInput } from './PhoneInput';
import { UserAvatar } from './UserAvatar';
import { getEmailProfilePicture } from '../utils/avatar';
import { triggerHapticFeedback } from '../utils/haptics';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onSaveProfile: (updatedUser: UserAccount) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
    return COUNTRIES.find(c => c.code === user.countryCode) || COUNTRIES[0];
  });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    if (!user.phoneNumber) return '';
    return user.phoneNumber.replace(user.dialCode, '').trim();
  });

  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = name.trim();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName) {
      setError('Please provide your name.');
      return;
    }

    if (cleanPhone) {
      const phoneValidation = validateInternationalPhoneNumber(cleanPhone, selectedCountry.dialCode);
      if (!phoneValidation.isValid) {
        setError(phoneValidation.error || 'Please enter a valid phone number format.');
        return;
      }
    }

    setIsSaving(true);
    triggerHapticFeedback('success');

    setTimeout(() => {
      const updated: UserAccount = {
        ...user,
        name: cleanName,
        photoUrl: getEmailProfilePicture(user.email),
        countryCode: selectedCountry.code,
        dialCode: selectedCountry.dialCode,
        phoneNumber: cleanPhone ? formatFullPhoneNumber(selectedCountry.dialCode, cleanPhone) : undefined,
      };

      onSaveProfile(updated);
      setIsSaving(false);
      onClose();
    }, 200);
  };

  return (
    <div 
      id="edit-profile-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="edit-profile-modal-container"
        className="bg-white dark:bg-[#16181E] border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto text-stone-900 dark:text-stone-100"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Edit Account Profile
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Manage your display name and contact details
            </p>
          </div>
          <button
            id="edit-profile-close-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email Profile Picture Display */}
          <div className="flex items-center space-x-4 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <UserAvatar
              email={user.email}
              name={name}
              photoUrl={user.photoUrl}
              size="xl"
            />
            <div className="min-w-0">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Email Profile Picture
              </span>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-snug">
                Your profile picture is automatically synced from your email address:
              </p>
              <p className="text-xs font-mono font-medium text-stone-800 dark:text-stone-200 truncate mt-0.5">
                {user.email}
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              id="edit-profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-[#0F6E4F]"
              required
            />
          </div>

          {/* Email Field (Read Only) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              id="edit-profile-email"
              value={user.email}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/60 text-xs text-stone-500 dark:text-stone-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-stone-400">
              Email is tied to your inbox sweeps and account credentials.
            </p>
          </div>

          {/* International Phone Number (Optional, All Countries) */}
          <PhoneInput
            countryCode={selectedCountry.code}
            dialCode={selectedCountry.dialCode}
            phoneNumber={phoneNumber}
            onCountryChange={(country) => setSelectedCountry(country)}
            onPhoneNumberChange={(num) => setPhoneNumber(num)}
            idPrefix="edit-phone"
          />

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              id="edit-profile-cancel-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="edit-profile-save-btn"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#0F6E4F] hover:bg-[#0c593f] active:scale-[0.99] text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
