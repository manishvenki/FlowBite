import React from 'react';

export interface SkeletonLoaderProps {
  type?: 'restaurant' | 'food' | 'category' | 'card' | 'line' | 'order' | 'table' | 'kpi';
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
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-3xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-48 sm:h-52 bg-gradient-to-br from-sand/70 via-sand/40 to-sand/60 w-full relative">
              <div className="absolute top-4 right-4 h-6 w-20 bg-sand/80 rounded-full" />
            </div>
            <div className="p-5 space-y-3.5">
              <div className="flex justify-between items-start gap-4">
                <div className="h-5 bg-sand/80 rounded-lg w-3/5" />
                <div className="h-5 bg-sand/70 rounded-full w-12 shrink-0" />
              </div>
              <div className="h-3.5 bg-sand/50 rounded w-2/5" />
              <div className="pt-3 flex justify-between items-center border-t border-sand-border/50">
                <div className="h-3.5 bg-sand/60 rounded-md w-24" />
                <div className="h-3.5 bg-sand/60 rounded-md w-16" />
              </div>
            </div>
          </div>
        );

      case 'food':
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl p-4 sm:p-5 flex gap-4 animate-pulse">
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-sand/70 bg-sand/50" />
                <div className="h-3.5 bg-sand/60 rounded w-16" />
              </div>
              <div className="h-5 bg-sand/80 rounded-lg w-4/5" />
              <div className="h-3 bg-sand/50 rounded w-full" />
              <div className="h-3 bg-sand/50 rounded w-3/5" />
              <div className="h-5 bg-sand/80 rounded-md w-24 pt-1" />
            </div>
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-sand/70 via-sand/50 to-sand/60 rounded-2xl shrink-0" />
          </div>
        );

      case 'category':
        return (
          <div className="flex flex-col items-center gap-2.5 p-3 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-sand/70 to-sand/50 shadow-sm border border-sand-border/50" />
            <div className="h-3.5 bg-sand/80 rounded-md w-16" />
          </div>
        );

      case 'order':
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl p-5 sm:p-6 space-y-4 animate-pulse shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sand-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sand/70 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 bg-sand/80 rounded w-32" />
                  <div className="h-3 bg-sand/50 rounded w-24" />
                </div>
              </div>
              <div className="h-6 bg-sand/70 rounded-full w-24" />
            </div>
            <div className="space-y-2 py-1">
              <div className="h-3.5 bg-sand/60 rounded w-3/4" />
              <div className="h-3 bg-sand/40 rounded w-1/2" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 bg-sand/80 rounded w-20" />
              <div className="h-8 bg-sand/70 rounded-xl w-28" />
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="w-full space-y-3 animate-pulse">
            <div className="h-10 bg-sand/40 rounded-xl w-full flex items-center px-4 gap-4">
              <div className="h-3 bg-sand/70 rounded w-1/6" />
              <div className="h-3 bg-sand/70 rounded w-1/4" />
              <div className="h-3 bg-sand/70 rounded w-1/6" />
              <div className="h-3 bg-sand/70 rounded w-1/6" />
              <div className="h-3 bg-sand/70 rounded w-1/12 ml-auto" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, rIdx) => (
                <div
                  key={rIdx}
                  className="h-12 bg-[#FFFDF5] border border-sand-border/40 rounded-xl flex items-center px-4 gap-4"
                >
                  <div className="w-6 h-6 rounded-lg bg-sand/60 shrink-0" />
                  <div className="h-3.5 bg-sand/70 rounded w-1/4" />
                  <div className="h-3 bg-sand/50 rounded w-1/5" />
                  <div className="h-5 bg-sand/60 rounded-full w-20" />
                  <div className="h-3 bg-sand/60 rounded w-16 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'kpi':
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl p-5 space-y-3 animate-pulse shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-3.5 bg-sand/60 rounded w-24" />
              <div className="w-9 h-9 rounded-xl bg-sand/60 shrink-0" />
            </div>
            <div className="h-7 bg-sand/80 rounded-lg w-28" />
            <div className="h-3 bg-sand/50 rounded w-36 pt-1" />
          </div>
        );

      case 'line':
        return <div className="h-4 bg-sand/70 rounded w-full animate-pulse" />;

      default:
        return (
          <div className="bg-[#FFFDF5] border border-sand-border/60 rounded-2xl p-5 space-y-3 animate-pulse shadow-sm">
            <div className="h-5 bg-sand/80 rounded w-1/3" />
            <div className="h-3.5 bg-sand/50 rounded w-full" />
            <div className="h-3.5 bg-sand/50 rounded w-4/5" />
          </div>
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
