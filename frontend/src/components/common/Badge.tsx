import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'olive' | 'sand' | 'terracotta' | 'neutral' | 'veg' | 'nonveg';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'olive',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    olive: 'bg-[#68734F]/15 text-olive-deep border border-olive/20',
    sand: 'bg-sand text-olive-dark border border-sand-border',
    terracotta: 'bg-[#B9674B]/15 text-terracotta-dark border border-terracotta/20',
    neutral: 'bg-sand-light text-olive-dark/80 border border-sand-border/60',
    veg: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    nonveg: 'bg-rose-50 text-rose-800 border border-rose-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full uppercase tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {variant === 'veg' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
      )}
      {variant === 'nonveg' && (
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
      )}
      {children}
    </span>
  );
};
