import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[#FFFDF5] border border-dashed border-sand-border rounded-2xl ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-sand/50 flex items-center justify-center text-olive mb-4">
        {icon || <UtensilsCrossed className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="font-serif-title text-xl font-bold text-olive-dark mb-2">
        {title}
      </h3>
      <p className="text-sm text-olive-dark/65 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
