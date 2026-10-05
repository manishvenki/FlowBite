import React, { useState, useEffect } from 'react';

export interface BiteFlowLoadingScreenProps {
  isLoading: boolean;
  message?: string;
}

interface FloatingFoodItem {
  id: string;
  icon: string;
  label: string;
  // Desktop positioning around center (percentage or px offsets)
  desktopClass: string;
  // Mobile positioning
  mobileClass: string;
  animationClass: string;
  sizeClass: string;
}

const FLOATING_FOOD_ITEMS: FloatingFoodItem[] = [
  {
    id: 'burger',
    icon: '🍔',
    label: 'Craft Burger',
    desktopClass: 'top-[14%] left-[22%]',
    mobileClass: 'top-[12%] left-[10%]',
    animationClass: 'animate-float-1',
    sizeClass: 'w-13 h-13 md:w-16 md:h-16 text-2xl md:text-3xl',
  },
  {
    id: 'pizza',
    icon: '🍕',
    label: 'Woodfired Pizza',
    desktopClass: 'top-[18%] right-[22%]',
    mobileClass: 'top-[14%] right-[10%]',
    animationClass: 'animate-float-2',
    sizeClass: 'w-14 h-14 md:w-16 md:h-16 text-2xl md:text-3xl',
  },
  {
    id: 'fries',
    icon: '🍟',
    label: 'Crispy Fries',
    desktopClass: 'bottom-[22%] left-[20%]',
    mobileClass: 'bottom-[18%] left-[12%]',
    animationClass: 'animate-float-3',
    sizeClass: 'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl',
  },
  {
    id: 'coffee',
    icon: '☕',
    label: 'Artisan Roast',
    desktopClass: 'bottom-[24%] right-[20%]',
    mobileClass: 'bottom-[18%] right-[12%]',
    animationClass: 'animate-float-4',
    sizeClass: 'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl',
  },
  {
    id: 'bag',
    icon: '🛍️',
    label: 'Swift Delivery',
    desktopClass: 'top-[44%] left-[12%]',
    mobileClass: 'top-[36%] left-[4%]',
    animationClass: 'animate-float-2',
    sizeClass: 'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl',
  },
  {
    id: 'plate',
    icon: '🍽️',
    label: 'Mindful Dining',
    desktopClass: 'top-[44%] right-[12%]',
    mobileClass: 'top-[36%] right-[4%]',
    animationClass: 'animate-float-1',
    sizeClass: 'w-12 h-12 md:w-14 md:h-14 text-xl md:text-2xl',
  },
  {
    id: 'sushi',
    icon: '🍣',
    label: 'Fresh Roll',
    desktopClass: 'top-[28%] left-[32%]',
    mobileClass: 'hidden sm:flex top-[24%] left-[24%]',
    animationClass: 'animate-float-4',
    sizeClass: 'w-11 h-11 md:w-13 md:h-13 text-lg md:text-xl',
  },
  {
    id: 'bowl',
    icon: '🥗',
    label: 'Healthy Greens',
    desktopClass: 'bottom-[30%] right-[32%]',
    mobileClass: 'hidden sm:flex bottom-[26%] right-[24%]',
    animationClass: 'animate-float-3',
    sizeClass: 'w-11 h-11 md:w-13 md:h-13 text-lg md:text-xl',
  },
];

export const BiteFlowLoadingScreen: React.FC<BiteFlowLoadingScreenProps> = ({
  isLoading,
  message = 'Curating Bengaluru’s finest dining...',
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
        fading ? 'opacity-0 scale-[0.98] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading BiteFlow"
      role="status"
    >
      {/* Background Decorative Ambient Radials */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-olive/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full bg-sand/30 blur-2xl" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full bg-terracotta/5 blur-3xl" />
      </div>

      {/* Floating Animated Food Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-5xl mx-auto">
        {FLOATING_FOOD_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`absolute flex items-center justify-center rounded-2xl bg-white/90 border border-sand-border/80 shadow-card backdrop-blur-sm transition-transform ${item.mobileClass} ${item.desktopClass} ${item.sizeClass} ${item.animationClass}`}
            title={item.label}
          >
            <span className="select-none transform transition-transform hover:scale-110">
              {item.icon}
            </span>
          </div>
        ))}
      </div>

      {/* Central Branding Card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-8">
        {/* Logo Container with Glowing Ring */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-3xl bg-olive/20 blur-md animate-pulse" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#FFFDF5] border border-sand-border p-3 shadow-card flex items-center justify-center">
            <img
              src="/logo.png"
              alt="BiteFlow Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center">
          <h1 className="font-serif-title text-3xl md:text-4xl font-bold tracking-tight text-olive-dark">
            Bite<span className="text-olive">Flow</span>
          </h1>
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-olive-dark/60 mt-1">
            Order. Prepare. Deliver.
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-48 md:w-56 h-1.5 bg-sand-border/60 rounded-full overflow-hidden mt-6 relative">
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-olive via-terracotta to-olive rounded-full animate-progress-shimmer" />
        </div>

        {/* Subtle Dynamic Status Message */}
        <p className="text-xs font-medium text-olive-dark/70 mt-3.5 tracking-wide animate-pulse">
          {message}
        </p>
      </div>

      {/* Inlined Keyframe Animations for Smooth Floating Physics */}
      <style>{`
        @keyframes floatSlow1 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(4deg);
          }
        }
        @keyframes floatSlow2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(14px) rotate(-5deg);
          }
        }
        @keyframes floatSlow3 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) translateX(6px) rotate(3deg);
          }
        }
        @keyframes floatSlow4 {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateY(10px) translateX(-6px) rotate(-4deg);
          }
        }
        @keyframes progressShimmer {
          0% {
            left: -50%;
            width: 40%;
          }
          50% {
            width: 60%;
          }
          100% {
            left: 110%;
            width: 40%;
          }
        }
        .animate-float-1 {
          animation: floatSlow1 4.2s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: floatSlow2 4.8s ease-in-out infinite;
        }
        .animate-float-3 {
          animation: floatSlow3 5.4s ease-in-out infinite;
        }
        .animate-float-4 {
          animation: floatSlow4 4.5s ease-in-out infinite;
        }
        .animate-progress-shimmer {
          animation: progressShimmer 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
