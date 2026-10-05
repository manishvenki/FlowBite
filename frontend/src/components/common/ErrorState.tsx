import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 bg-[#FFFDF5] border border-terracotta/20 rounded-2xl ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center text-terracotta mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="font-serif-title text-xl font-bold text-olive-dark mb-2">
        {title}
      </h3>
      <p className="text-sm text-olive-dark/70 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
