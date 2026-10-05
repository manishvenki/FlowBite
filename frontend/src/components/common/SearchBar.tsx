import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch?: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search dishes, restaurants or cuisines...',
  className = '',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-4 text-olive-dark/40 pointer-events-none">
        <Search className="w-5 h-5 text-olive" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FFFDF5] text-olive-dark placeholder:text-olive-dark/40 border border-sand-border rounded-2xl py-3.5 pl-12 pr-12 text-sm md:text-base shadow-subtle focus:border-olive focus:ring-4 focus:ring-olive/10 outline-none transition-all duration-200"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 p-1 rounded-full text-olive-dark/40 hover:text-olive-dark hover:bg-sand/50 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};
