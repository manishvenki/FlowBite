import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={`bg-[#FFFDF5] border border-sand-border/80 rounded-2xl shadow-card transition-all duration-300 ${
        hoverable ? 'hover:shadow-card-hover hover:-translate-y-0.5' : ''
      } ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
