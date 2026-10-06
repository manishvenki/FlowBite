import React from 'react';
import { BiteFlowLoadingScreen } from './BiteFlowLoadingScreen';

export interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  text = 'Getting your table ready...',
  size = 'md',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return <BiteFlowLoadingScreen isLoading={true} message={text} />;
  }

  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <div
        className={`${sizeClasses[size]} rounded-full border-sand-border/80 border-t-olive animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <p className="text-xs sm:text-sm font-medium text-olive-dark/70 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
