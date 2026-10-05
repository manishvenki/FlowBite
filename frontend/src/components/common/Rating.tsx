import React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  size = 'md',
  showNumber = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center text-olive">
        <Star className={`${iconSizes[size]} fill-olive text-olive`} />
      </div>
      {showNumber && (
        <span className={`text-olive-dark ${textSizes[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-olive-dark/50">({count})</span>
      )}
    </div>
  );
};
