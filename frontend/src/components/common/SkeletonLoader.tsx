import React from 'react';

export interface SkeletonLoaderProps {
  type?: 'restaurant' | 'food' | 'category' | 'card' | 'line';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'restaurant':
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 bg-sand/60 w-full" />
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-sand/80 rounded w-2/3" />
                <div className="h-4 bg-sand/60 rounded w-10" />
              </div>
              <div className="h-4 bg-sand/50 rounded w-1/2" />
              <div className="pt-2 flex justify-between items-center border-t border-sand-border/40">
                <div className="h-3 bg-sand/50 rounded w-1/4" />
                <div className="h-3 bg-sand/50 rounded w-1/4" />
              </div>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl p-4 flex gap-4 animate-pulse">
            <div className="flex-1 space-y-2.5">
              <div className="h-3 bg-sand/60 rounded w-16" />
              <div className="h-5 bg-sand/80 rounded w-3/4" />
              <div className="h-3 bg-sand/50 rounded w-full" />
              <div className="h-3 bg-sand/50 rounded w-2/3" />
              <div className="h-5 bg-sand/80 rounded w-20 pt-1" />
            </div>
            <div className="w-28 h-28 bg-sand/60 rounded-xl shrink-0" />
          </div>
        );

      case 'category':
        return (
          <div className="flex flex-col items-center gap-2 p-3 animate-pulse">
            <div className="w-20 h-20 rounded-2xl bg-sand/70" />
            <div className="h-3.5 bg-sand/80 rounded w-16" />
          </div>
        );

      case 'line':
        return <div className="h-4 bg-sand/70 rounded w-full animate-pulse" />;

      default:
        return (
          <div className="h-32 bg-sand/50 rounded-2xl w-full animate-pulse" />
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={className}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
};
