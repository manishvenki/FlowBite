import React from 'react';

interface RupeeIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RupeeIcon: React.FC<RupeeIconProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs w-4 h-4',
    md: 'text-base w-5 h-5',
    lg: 'text-xl w-6 h-6',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold font-sans select-none leading-none ${sizeClasses[size]} ${className}`}
      aria-label="Indian Rupee"
    >
      ₹
    </span>
  );
};
