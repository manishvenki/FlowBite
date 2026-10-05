import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  backTo,
  action,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-sand-border/70 ${className}`}>
      <div className="flex items-start gap-4">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl border border-sand-border bg-[#FFFDF5] text-olive-dark hover:bg-sand/40 hover:border-olive/30 transition-all active:scale-95 shrink-0 mt-0.5"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-olive" />
          </button>
        )}
        <div>
          <h1 className="font-serif-title text-2xl md:text-3xl lg:text-4xl font-bold text-olive-dark tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm md:text-base text-olive-dark/70 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};
