import React, { useState, useEffect } from 'react';
import { getEmailProfilePicture } from '../utils/avatar';

interface UserAvatarProps {
  email?: string;
  name?: string;
  photoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  email = '',
  name = '',
  photoUrl,
  size = 'md',
  className = '',
  id,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derive initial from name or email
  const initial = (name.trim() || email.split('@')[0] || 'U')[0].toUpperCase();

  // Resolved avatar URL: custom photoUrl, or exact picture on email
  const resolvedUrl = photoUrl || (email ? getEmailProfilePicture(email) : '');

  useEffect(() => {
    setImageError(false);
    setIsLoaded(false);
  }, [resolvedUrl]);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  }[size];

  return (
    <div
      id={id}
      className={`relative ${sizeClasses} rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold bg-[#0F6E4F]/10 dark:bg-[#0F6E4F]/25 text-[#0F6E4F] dark:text-[#34D399] border border-stone-200/80 dark:border-stone-700/80 select-none ${className}`}
    >
      {/* Fallback Initial always present in DOM behind image */}
      <span>{initial}</span>

      {/* Exact email profile picture */}
      {resolvedUrl && !imageError && (
        <img
          src={resolvedUrl}
          alt={name || email || 'Avatar'}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
