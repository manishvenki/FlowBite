import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, startIcon, endIcon, className = '', id, type, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const passwordToggle = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-olive-dark/50 hover:text-olive focus:outline-none p-1 transition-colors rounded-md active:scale-95 cursor-pointer"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        title={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    ) : null;

    const resolvedEndIcon = endIcon || passwordToggle;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-olive-dark/80">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3.5 text-olive-dark/50 pointer-events-none flex items-center">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={computedType}
            className={`w-full bg-[#FFFDF5] text-olive-dark placeholder:text-olive-dark/40 border rounded-xl py-2.5 text-sm transition-all duration-200 outline-none ${
              startIcon ? 'pl-10' : 'pl-3.5'
            } ${resolvedEndIcon ? 'pr-11' : 'pr-3.5'} ${
              error
                ? 'border-terracotta focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                : 'border-sand-border focus:border-olive focus:ring-2 focus:ring-olive/20'
            } disabled:bg-sand/30 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {resolvedEndIcon && (
            <div className="absolute right-3 text-olive-dark/50 flex items-center">
              {resolvedEndIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-terracotta font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-olive-dark/60 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
