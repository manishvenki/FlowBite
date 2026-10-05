import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  allowDeleteOnZero?: boolean;
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  size = 'md',
  allowDeleteOnZero = true,
  className = '',
}) => {
  const isSm = size === 'sm';

  return (
    <div
      className={`inline-flex items-center bg-[#FAF7EE] border border-sand-border rounded-xl select-none ${
        isSm ? 'p-0.5' : 'p-1'
      } ${className}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={quantity <= min && !allowDeleteOnZero}
        className={`flex items-center justify-center rounded-lg text-olive-dark hover:bg-sand/70 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-6 h-6' : 'w-8 h-8'
        }`}
        aria-label="Decrease quantity"
      >
        {quantity === 1 && allowDeleteOnZero ? (
          <Trash2 className={isSm ? 'w-3 h-3 text-terracotta' : 'w-3.5 h-3.5 text-terracotta'} />
        ) : (
          <Minus className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        )}
      </button>

      <span
        className={`font-semibold text-center text-olive-dark ${
          isSm ? 'w-6 text-xs' : 'w-8 text-sm'
        }`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={quantity >= max}
        className={`flex items-center justify-center rounded-lg bg-olive text-[#FFFDF5] hover:bg-olive/90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
          isSm ? 'w-6 h-6' : 'w-8 h-8'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>
    </div>
  );
};
