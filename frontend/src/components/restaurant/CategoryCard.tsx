import React from 'react';
import { Category } from '../../types/category';

export interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-2.5 p-3 rounded-2xl transition-all duration-200 select-none text-center ${
        isSelected
          ? 'bg-olive text-[#FFFDF5] shadow-card scale-105'
          : 'bg-[#FFFDF5] text-olive-dark hover:bg-sand/40 border border-sand-border/80 shadow-subtle'
      }`}
    >
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden p-1 transition-all duration-200 ${
          isSelected ? 'bg-olive-light/40 ring-2 ring-white/50' : 'bg-sand/40 group-hover:scale-105'
        }`}
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </div>
      <span className="text-xs sm:text-sm font-semibold tracking-tight leading-tight line-clamp-1">
        {category.name}
      </span>
    </button>
  );
};
