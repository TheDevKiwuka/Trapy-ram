export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  dialCode: string; // e.g. "+1", "+44"
  flag: string; // Emoji/character flag
  format?: string; // Example pattern
}

export const COUNTRIES: Country[] = [
  // North America
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸', format: '(555) 000-0000' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦', format: '(555) 000-0000' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽', format: '55 1234 5678' },
  
  // Europe
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧', format: '7911 123456' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪', format: '151 12345678' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷', format: '6 12 34 56 78' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸', format: '612 34 56 78' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹', format: '312 345 6789' },
  { name: 'Netherlands', code: 'NL', dialCode: '+31', flag: '🇳🇱', format: '6 12345678' },
  { name: 'Switzerland', code: 'CH', dialCode: '+41', flag: '🇨🇭', format: '78 123 45 67' },
  { name: 'Sweden', code: 'SE', dialCode: '+46', flag: '🇸🇪', format: '70 123 45 67' },
  { name: 'Norway', code: 'NO', dialCode: '+47', flag: '🇳🇴', format: '412 34 567' },
  { name: 'Denmark', code: 'DK', dialCode: '+45', flag: '🇩🇰', format: '20 12 34 56' },
  { name: 'Finland', code: 'FI', dialCode: '+358', flag: '🇫🇮', format: '40 1234567' },
  { name: 'Ireland', code: 'IE', dialCode: '+353', flag: '🇮🇪', format: '85 123 4567' },
  { name: 'Belgium', code: 'BE', dialCode: '+32', flag: '🇧🇪', format: '470 12 34 56' },
  { name: 'Austria', code: 'AT', dialCode: '+43', flag: '🇦🇹', format: '664 1234567' },
  { name: 'Portugal', code: 'PT', dialCode: '+351', flag: '🇵🇹', format: '912 345 678' },
  { name: 'Poland', code: 'PL', dialCode: '+48', flag: '🇵🇱', format: '512 345 678' },
  { name: 'Greece', code: 'GR', dialCode: '+30', flag: '🇬🇷', format: '691 234 5678' },
  { name: 'Czech Republic', code: 'CZ', dialCode: '+420', flag: '🇨🇿', format: '601 123 456' },
  { name: 'Romania', code: 'RO', dialCode: '+40', flag: '🇷🇴', format: '712 345 678' },
  { name: 'Hungary', code: 'HU', dialCode: '+36', flag: '🇭🇺', format: '20 123 4567' },
  { name: 'Ukraine', code: 'UA', dialCode: '+380', flag: '🇺🇦', format: '50 123 4567' },

  // Asia & Oceania
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺', format: '412 345 678' },
  { name: 'New Zealand', code: 'NZ', dialCode: '+64', flag: '🇳🇿', format: '21 123 4567' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵', format: '90 1234 5678' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳', format: '131 2345 6789' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳', format: '98123 45678' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', flag: '🇸🇬', format: '8123 4567' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', flag: '🇰🇷', format: '10 1234 5678' },
  { name: 'Indonesia', code: 'ID', dialCode: '+62', flag: '🇮🇩', format: '812 3456 789' },
  { name: 'Malaysia', code: 'MY', dialCode: '+60', flag: '🇲🇾', format: '12 345 6789' },
  { name: 'Philippines', code: 'PH', dialCode: '+63', flag: '🇵🇭', format: '912 345 6789' },
  { name: 'Vietnam', code: 'VN', dialCode: '+84', flag: '🇻🇳', format: '91 234 5678' },
  { name: 'Thailand', code: 'TH', dialCode: '+66', flag: '🇹🇭', format: '81 234 5678' },
  { name: 'Pakistan', code: 'PK', dialCode: '+92', flag: '🇵🇰', format: '300 1234567' },
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: '🇧🇩', format: '1712 345678' },
  { name: 'Taiwan', code: 'TW', dialCode: '+886', flag: '🇹🇼', format: '912 345 678' },
  { name: 'Hong Kong', code: 'HK', dialCode: '+852', flag: '🇭🇰', format: '9123 4567' },

  // Africa
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪', format: '712 345 678' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬', format: '802 123 4567' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦', format: '71 234 5678' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬', format: '10 1234 5678' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭', format: '24 123 4567' },
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹', format: '91 123 4567' },
  { name: 'Tanzania', code: 'TZ', dialCode: '+255', flag: '🇹🇿', format: '71 234 5678' },
  { name: 'Uganda', code: 'UG', dialCode: '+256', flag: '🇺🇬', format: '77 123 4567' },
  { name: 'Rwanda', code: 'RW', dialCode: '+250', flag: '🇷🇼', format: '78 123 4567' },
  { name: 'Morocco', code: 'MA', dialCode: '+212', flag: '🇲🇦', format: '61 234 5678' },
  { name: 'Senegal', code: 'SN', dialCode: '+221', flag: '🇸🇳', format: '77 123 45 67' },
  { name: 'Ivory Coast', code: 'CI', dialCode: '+225', flag: '🇨🇮', format: '07 12 34 56' },

  // Middle East & Latin America
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪', format: '50 123 4567' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦', format: '50 123 4567' },
  { name: 'Israel', code: 'IL', dialCode: '+972', flag: '🇮🇱', format: '50 123 4567' },
  { name: 'Turkey', code: 'TR', dialCode: '+90', flag: '🇹🇷', format: '532 123 45 67' },
  { name: 'Qatar', code: 'QA', dialCode: '+974', flag: '🇶🇦', format: '3312 3456' },
  { name: 'Kuwait', code: 'KW', dialCode: '+965', flag: '🇰🇼', format: '9123 4567' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷', format: '11 91234-5678' },
  { name: 'Argentina', code: 'AR', dialCode: '+54', flag: '🇦🇷', format: '9 11 1234-5678' },
  { name: 'Chile', code: 'CL', dialCode: '+56', flag: '🇨🇱', format: '9 1234 5678' },
  { name: 'Colombia', code: 'CO', dialCode: '+57', flag: '🇨🇴', format: '300 123 4567' },
  { name: 'Peru', code: 'PE', dialCode: '+51', flag: '🇵🇪', format: '912 345 678' },
];

/**
 * Validates international phone numbers based on ITU-T E.164:
 * Total length of digits (country dial code + national number) must be between 7 and 15 digits.
 */
export function validateInternationalPhoneNumber(phone: string, dialCode: string): { isValid: boolean; error?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: true }; // Optional field
  }

  // Remove non-digit characters to count actual digits
  const rawDigits = trimmed.replace(/\D/g, '');
  const dialDigits = dialCode.replace(/\D/g, '');
  const totalDigits = dialDigits.length + rawDigits.length;

  if (rawDigits.length < 5) {
    return { isValid: false, error: 'Phone number is too short (minimum 5 national digits).' };
  }

  if (totalDigits > 15) {
    return { isValid: false, error: 'Phone number exceeds ITU-T E.164 limit (maximum 15 total digits).' };
  }

  // Check that input doesn't contain forbidden symbols
  if (/[^0-9\s\-().]/.test(trimmed)) {
    return { isValid: false, error: 'Phone number contains invalid characters.' };
  }

  return { isValid: true };
}

/**
 * Formats a dial code and national number into standard E.164 display string.
 */
export function formatFullPhoneNumber(dialCode: string, nationalNumber: string): string {
  const cleaned = nationalNumber.trim();
  if (!cleaned) return '';
  return `${dialCode} ${cleaned}`;
}
