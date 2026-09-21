import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Globe } from 'lucide-react';
import { COUNTRIES, Country, validateInternationalPhoneNumber } from '../data/countries';

interface PhoneInputProps {
  countryCode: string;
  dialCode: string;
  phoneNumber: string;
  onCountryChange: (country: Country) => void;
  onPhoneNumberChange: (number: string) => void;
  idPrefix?: string;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  dialCode,
  phoneNumber,
  onCountryChange,
  onPhoneNumberChange,
  idPrefix = 'phone',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find currently selected country or fallback to US
  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter countries by name, code, or dialCode
  const filteredCountries = COUNTRIES.filter(country => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      country.name.toLowerCase().includes(q) ||
      country.code.toLowerCase().includes(q) ||
      country.dialCode.toLowerCase().includes(q) ||
      country.dialCode.replace('+', '').includes(q)
    );
  });

  const handleSelectCountry = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const validation = validateInternationalPhoneNumber(phoneNumber, dialCode);
  const displayError = error || (!validation.isValid && phoneNumber.trim().length > 0 ? validation.error : undefined);

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={`${idPrefix}-number-input`} 
          className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center space-x-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-stone-400" />
          <span>Phone Number</span>
          <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500">(Optional - Global)</span>
        </label>
        {phoneNumber.trim() && validation.isValid && (
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
            <Check className="w-3 h-3" />
            <span>Valid format</span>
          </span>
        )}
      </div>

      <div className="relative flex rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#1A1D24] shadow-xs focus-within:ring-2 focus-within:ring-[#0F6E4F] focus-within:border-transparent transition-all">
        
        {/* Country Selector Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id={`${idPrefix}-country-trigger`}
            onClick={() => setIsOpen(prev => !prev)}
            className="h-full px-3 py-2.5 flex items-center space-x-1.5 bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/80 dark:hover:bg-stone-800 rounded-l-xl border-r border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors shrink-0"
            aria-label="Select Country Code"
            aria-expanded={isOpen}
          >
            <span className="text-base leading-none" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Searchable Country Dropdown Menu */}
          {isOpen && (
            <div 
              id={`${idPrefix}-country-dropdown`}
              className="absolute left-0 top-full mt-1.5 w-72 max-h-72 rounded-xl bg-white dark:bg-[#1A1D24] border border-stone-200 dark:border-stone-700 shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-100"
            >
              {/* Search Bar */}
              <div className="p-2 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 sticky top-0 z-10">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code (+44, Kenya...)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#15171C] rounded-lg border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-[#0F6E4F]"
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50 py-1">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => {
                    const isSelected = country.code === selectedCountry.code;
                    return (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => handleSelectCountry(country)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors ${
                          isSelected ? 'bg-[#0F6E4F]/10 dark:bg-[#0F6E4F]/20 text-[#0F6E4F] dark:text-[#34D399] font-semibold' : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate mr-2">
                          <span className="text-base leading-none">{country.flag}</span>
                          <span className="truncate">{country.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
                            {country.dialCode}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#0F6E4F] dark:text-[#34D399]" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-stone-400">
                    No countries matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* National Number Input */}
        <input
          type="tel"
          id={`${idPrefix}-number-input`}
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          placeholder={selectedCountry.format || '123 456 7890'}
          className="w-full px-3 py-2.5 text-xs text-stone-900 dark:text-stone-100 bg-transparent focus:outline-hidden placeholder:text-stone-400"
          autoComplete="tel-national"
        />

        {phoneNumber && (
          <button
            type="button"
            onClick={() => onPhoneNumberChange('')}
            className="px-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs transition-colors shrink-0"
            title="Clear phone number"
          >
            &times;
          </button>
        )}
      </div>

      {displayError ? (
        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
          {displayError}
        </p>
      ) : (
        <p className="text-[11px] text-stone-400 dark:text-stone-500">
          Used for security alerts and critical unsubscribe notifications.
        </p>
      )}
    </div>
  );
};
