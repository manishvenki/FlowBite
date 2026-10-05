import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  text = 'Loading...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-olive`} />
      {text && (
        <p className="text-sm font-medium text-olive-dark/70 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
