import React, { useState, useEffect } from 'react';

export interface BiteFlowLoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

// Minimal, hand-drawn editorial food line-art icons (no emojis)
const BurgerLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M4 11a8 8 0 0 1 16 0H4z" />
    <path d="M8.5 7.5h.01M12 6.5h.01M15.5 7.5h.01" strokeWidth="1.6" />
    <path d="M3.5 13.5c.8 0 1.2-.6 2-.6s1.2.6 2 .6 1.2-.6 2-.6 1.2.6 2 .6 1.2-.6 2-.6 1.2.6 2 .6 1.2-.6 2-.6 1.2.6 2 .6" />
    <path d="M4 16h16" strokeWidth="1.5" />
    <path d="M5 18.5a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5H5z" />
  </svg>
);

const PizzaLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M3.5 6.5c5.5-2.5 11.5-2.5 17 0" strokeWidth="1.5" />
    <path d="M3.5 6.5l7.5 14a1.2 1.2 0 0 0 2 0l7.5-14" />
    <circle cx="12" cy="11.5" r="1.3" />
    <circle cx="8.5" cy="9.5" r="1" />
    <circle cx="15.5" cy="10" r="1" />
  </svg>
);

const CoffeeLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
    <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
    <path d="M2.5 20h15" />
    <path d="M7 3.5c0 1.2-.8 1.8-.8 2.5M10 2.8c0 1.2-.8 1.8-.8 2.5M13 3.5c0 1.2-.8 1.8-.8 2.5" />
  </svg>
);

const CutleryLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M5 3.5v5a2 2 0 0 0 2 2v10" />
    <path d="M5 3.5h4v5a2 2 0 0 1-2 2" />
    <path d="M7 3.5v5" />
    <path d="M17 3.5a2.2 3.2 0 0 0-2.2 3.2c0 1.6 1.3 2.8 2.2 3.3v10.5" />
    <path d="M17 3.5a2.2 3.2 0 0 1 2.2 3.2c0 1.6-1.3 2.8-2.2 3.3" />
  </svg>
);

const ClocheLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <circle cx="12" cy="6" r="1.5" />
    <path d="M4 16a8 8 0 0 1 16 0H4z" />
    <path d="M2 19h20" strokeWidth="1.5" />
  </svg>
);

const TakeawayBagLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M5 7l1.5 13a2 2 0 0 0 2 1.8h7a2 2 0 0 0 2-1.8L19 7H5z" />
    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    <path d="M12 12v3M10.5 13.5h3" strokeWidth="1.1" />
  </svg>
);

const HerbSprigLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <path d="M4 20c4-4 8-10 16-16" />
    <path d="M14 5c0 3-2 5-5 5" />
    <path d="M19 10c-3 0-5 2-5 5" />
    <path d="M9 10c0 3-2 5-5 5" />
  </svg>
);

const PlateLineIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 md:w-6 md:h-6"
  >
    <circle cx="12" cy="12" r="9" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="5.5" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

interface DoodleElement {
  id: string;
  component: React.FC;
  desktopClass: string;
  mobileClass: string;
  animationClass: string;
  colorClass: string;
}

const DOODLES: DoodleElement[] = [
  {
    id: 'cloche',
    component: ClocheLineIcon,
    desktopClass: 'top-[16%] left-[20%]',
    mobileClass: 'top-[12%] left-[8%]',
    animationClass: 'animate-doodle-float-1',
    colorClass: 'text-olive/70',
  },
  {
    id: 'pizza',
    component: PizzaLineIcon,
    desktopClass: 'top-[18%] right-[20%]',
    mobileClass: 'top-[12%] right-[8%]',
    animationClass: 'animate-doodle-float-2',
    colorClass: 'text-terracotta/70',
  },
  {
    id: 'coffee',
    component: CoffeeLineIcon,
    desktopClass: 'bottom-[22%] left-[18%]',
    mobileClass: 'bottom-[14%] left-[8%]',
    animationClass: 'animate-doodle-float-3',
    colorClass: 'text-olive-dark/65',
  },
  {
    id: 'cutlery',
    component: CutleryLineIcon,
    desktopClass: 'bottom-[20%] right-[18%]',
    mobileClass: 'bottom-[14%] right-[8%]',
    animationClass: 'animate-doodle-float-4',
    colorClass: 'text-olive/70',
  },
  {
    id: 'burger',
    component: BurgerLineIcon,
    desktopClass: 'top-[44%] left-[12%]',
    mobileClass: 'hidden md:flex top-[42%] left-[8%]',
    animationClass: 'animate-doodle-float-2',
    colorClass: 'text-olive-dark/60',
  },
  {
    id: 'bag',
    component: TakeawayBagLineIcon,
    desktopClass: 'top-[44%] right-[12%]',
    mobileClass: 'hidden md:flex top-[42%] right-[8%]',
    animationClass: 'animate-doodle-float-1',
    colorClass: 'text-terracotta/65',
  },
  {
    id: 'herb',
    component: HerbSprigLineIcon,
    desktopClass: 'top-[28%] left-[32%]',
    mobileClass: 'hidden lg:flex top-[24%] left-[24%]',
    animationClass: 'animate-doodle-float-4',
    colorClass: 'text-olive/60',
  },
  {
    id: 'plate',
    component: PlateLineIcon,
    desktopClass: 'bottom-[28%] right-[30%]',
    mobileClass: 'hidden lg:flex bottom-[24%] right-[24%]',
    animationClass: 'animate-doodle-float-3',
    colorClass: 'text-olive/55',
  },
];

export const BiteFlowLoadingScreen: React.FC<BiteFlowLoadingScreenProps> = ({
  isLoading,
  message = 'Preparing your order',
}) => {
  const [visible, setVisible] = useState(isLoading);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!isLoading && visible) {
      setFading(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else if (isLoading && !visible) {
      setVisible(true);
      setFading(false);
    }
  }, [isLoading, visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FFFDF5] transition-all duration-500 ease-in-out ${
        fading ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading BiteFlow"
      role="status"
    >
      {/* Subtle Warm Background Organic Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-sand/35 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-olive/5 blur-2xl" />
      </div>

      {/* Floating Editorial Line-Art Doodles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-5xl mx-auto">
        {DOODLES.map((doodle) => {
          const IconComponent = doodle.component;
          return (
            <div
              key={doodle.id}
              className={`absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#FFFDF5]/85 border border-sand-border/70 shadow-[0_2px_12px_rgba(63,73,51,0.04)] backdrop-blur-[2px] transition-transform ${doodle.mobileClass} ${doodle.desktopClass} ${doodle.animationClass} ${doodle.colorClass}`}
              aria-hidden="true"
            >
              <IconComponent />
            </div>
          );
        })}
      </div>

      {/* Center Branding Stage */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-8 max-w-sm">
        {/* Subtle accent icon above logo */}
        <div className="text-olive/50 mb-3 animate-doodle-float-subtle" aria-hidden="true">
          <HerbSprigLineIcon />
        </div>

        {/* Existing BiteFlow Brand Logo */}
        <div className="relative mb-3">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#FFFDF5] border border-sand-border/80 p-2.5 shadow-subtle flex items-center justify-center">
            <img
              src="/logo.png"
              alt="BiteFlow"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="font-serif-title text-2xl md:text-3xl font-bold tracking-tight text-olive-dark">
          Bite<span className="text-olive">Flow</span>
        </h1>

        {/* Supporting Loading Text */}
        <p className="font-sans text-xs md:text-sm text-olive-dark/70 font-medium tracking-wide mt-1.5">
          {message}
        </p>

        {/* Minimal Editorial 3-Dot Loading Indicator */}
        <div className="flex items-center gap-1.5 mt-4" aria-hidden="true">
          <span
            className="w-1.5 h-1.5 rounded-full bg-olive/60 animate-dot-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-olive/85 animate-dot-pulse"
            style={{ animationDelay: '200ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-olive/60 animate-dot-pulse"
            style={{ animationDelay: '400ms' }}
          />
        </div>
      </div>

      {/* Pure CSS Keyframe Animations for Natural, Premium Floating Physics */}
      <style>{`
        @keyframes doodleFloat1 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }
        @keyframes doodleFloat2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(9px) rotate(-3deg);
          }
        }
        @keyframes doodleFloat3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) translateX(4px) rotate(2deg);
          }
        }
        @keyframes doodleFloat4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(7px) translateX(-4px) rotate(-2deg);
          }
        }
        @keyframes doodleFloatSubtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(0.85);
            opacity: 0.45;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }
        .animate-doodle-float-1 {
          animation: doodleFloat1 5.4s ease-in-out infinite;
        }
        .animate-doodle-float-2 {
          animation: doodleFloat2 6.2s ease-in-out infinite;
        }
        .animate-doodle-float-3 {
          animation: doodleFloat3 5.8s ease-in-out infinite;
        }
        .animate-doodle-float-4 {
          animation: doodleFloat4 6.6s ease-in-out infinite;
        }
        .animate-doodle-float-subtle {
          animation: doodleFloatSubtle 4.0s ease-in-out infinite;
        }
        .animate-dot-pulse {
          animation: dotPulse 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
