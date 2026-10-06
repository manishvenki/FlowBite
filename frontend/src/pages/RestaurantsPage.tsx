import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Category } from '../types/category';
import { restaurantService } from '../services/restaurantService';
import { categoryService } from '../services/categoryService';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { SearchBar } from '../components/common/SearchBar';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { PageHeader } from '../components/common/PageHeader';

/**
 * Robust, case-insensitive, token-aware matching between a restaurant and a cuisine filter.
 * Handles single cuisines ("Pizza", "Burger", "Indian"), composite categories ("Biryani & Pulao"),
 * comma-separated restaurant tags ("North Indian, Mughlai, Tandoor"), and whitespace/capitalization variations.
 */
export const matchRestaurantCuisine = (restaurant: Restaurant, cuisineFilter: string): boolean => {
  if (!cuisineFilter || cuisineFilter === 'All') return true;

  const target = cuisineFilter.trim().toLowerCase();
  if (!target || target === 'all') return true;

  const restCuisine = (restaurant.cuisine || '').trim().toLowerCase();
  const restName = (restaurant.name || '').trim().toLowerCase();
  const restDesc = (restaurant.description || '').trim().toLowerCase();

  // 1. Direct or substring match in restaurant.cuisine (e.g. "indian" matches "north indian, mughlai")
  if (restCuisine.includes(target) || target.includes(restCuisine)) {
    return true;
  }

  // 2. Tokenized match on comma/slash-separated cuisine items
  const restTokens = restCuisine.split(/[,;/]+/).map((t) => t.trim()).filter(Boolean);
  if (restTokens.some((token) => token === target || token.includes(target) || target.includes(token))) {
    return true;
  }

  // 3. Composite target tokens (e.g. "Biryani & Pulao" -> matches "biryani" or "pulao")
  const targetTokens = target
    .split(/[&,;/+]|\band\b/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  if (targetTokens.some((tToken) => {
    return (
      restCuisine.includes(tToken) ||
      restTokens.some((rToken) => rToken.includes(tToken) || tToken.includes(rToken))
    );
  })) {
    return true;
  }

  // 4. Restaurant name or description keyword match (e.g. dishes, specialties, styles)
  if (restName.includes(target) || restDesc.includes(target)) {
    return true;
  }

  if (targetTokens.some((tToken) => restName.includes(tToken) || restDesc.includes(tToken))) {
    return true;
  }

  return false;
};

export const RestaurantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const cuisineParam = searchParams.get('cuisine') || 'All';

  const [rawRestaurants, setRawRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineParam);
  const [onlyOpen, setOnlyOpen] = useState(false);

  // Synchronize selectedCuisine whenever URL query param changes
  useEffect(() => {
    setSelectedCuisine(cuisineParam);
  }, [cuisineParam]);

  // Load categories from API
  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch restaurants matching search and open status
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getRestaurants({
        search: searchTerm.trim() || undefined,
        isOpen: onlyOpen ? true : undefined,
      });
      setRawRestaurants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [onlyOpen]);

  // Handle search submission
  const handleSearchSubmit = (val: string) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (val.trim()) {
        updated.set('search', val.trim());
      } else {
        updated.delete('search');
      }
      return updated;
    });
    fetchRestaurants();
  };

  // Handle cuisine button click
  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (!cuisine || cuisine === 'All' || cuisine.toLowerCase() === 'all') {
        updated.delete('cuisine');
      } else {
        updated.set('cuisine', cuisine);
      }
      return updated;
    });
  };

  // Dynamically extract all actual cuisine values present in the API data
  const cuisineOptions = (() => {
    const optionsMap = new Map<string, string>(); // normalizedKey -> displayName

    // 1. From loaded categories
    (categories || []).forEach((cat) => {
      const raw = (cat?.name || '').trim();
      if (raw) {
        optionsMap.set(raw.toLowerCase(), raw);
      }
    });

    // 2. From loaded restaurants' cuisine field (split comma/semicolon/slash separated tokens)
    (rawRestaurants || []).forEach((rest) => {
      if (rest?.cuisine) {
        const parts = rest.cuisine.split(/[,;/]+/).map((p) => p.trim()).filter(Boolean);
        parts.forEach((part) => {
          const norm = part.toLowerCase();
          if (!optionsMap.has(norm)) {
            const formatted = part
              .split(/\s+/)
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ');
            optionsMap.set(norm, formatted);
          }
        });
      }
    });

    // 3. If selectedCuisine is active and not yet present, include it
    if (selectedCuisine && selectedCuisine !== 'All') {
      const norm = selectedCuisine.trim().toLowerCase();
      if (!optionsMap.has(norm)) {
        const formatted = selectedCuisine
          .trim()
          .split(/\s+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
        optionsMap.set(norm, formatted);
      }
    }

    return Array.from(optionsMap.values());
  })();

  // Filter restaurants by selected cuisine directly
  const displayedRestaurants = (rawRestaurants || []).filter((rest) =>
    matchRestaurantCuisine(rest, selectedCuisine)
  );

  const isAllSelected = !selectedCuisine || selectedCuisine === 'All' || selectedCuisine.toLowerCase() === 'all';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Artisanal Kitchens"
        subtitle="Explore verified restaurants delivering handcrafted recipes directly to your doorstep."
      />

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex-1 max-w-xl">
          <SearchBar
            value={searchTerm}
            onChange={(val) => {
              setSearchTerm(val);
              if (!val.trim()) {
                setSearchParams((prev) => {
                  const updated = new URLSearchParams(prev);
                  updated.delete('search');
                  return updated;
                });
                fetchRestaurants();
              }
            }}
            onSearch={handleSearchSubmit}
            placeholder="Search kitchens by name, dish or flavors..."
          />
        </div>

        {/* Open Now Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all select-none shadow-subtle ${
              onlyOpen
                ? 'bg-olive text-[#FFFDF5] border-olive'
                : 'bg-[#FFFDF5] text-olive-dark border-sand-border hover:bg-sand/30'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                onlyOpen ? 'border-white bg-white text-olive' : 'border-olive-dark/40'
              }`}
            >
              {onlyOpen && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Open Now Only</span>
          </button>
        </div>
      </div>

      {/* Cuisine Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCuisineChange('All')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
            isAllSelected
              ? 'bg-olive text-[#FFFDF5] shadow-sm'
              : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/80'
          }`}
        >
          All Cuisines
        </button>
        {cuisineOptions.map((opt) => {
          const isSelected = selectedCuisine.trim().toLowerCase() === opt.trim().toLowerCase();
          return (
            <button
              key={opt}
              onClick={() => handleCuisineChange(opt)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-olive text-[#FFFDF5] shadow-sm'
                  : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/80'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Restaurant Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="restaurant" count={6} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRestaurants} />
      ) : displayedRestaurants.length === 0 ? (
        <EmptyState
          title="No kitchens found"
          description={`We couldn't find any restaurants matching "${selectedCuisine}". Try adjusting your criteria or exploring all cuisines.`}
          actionText="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCuisine('All');
            setOnlyOpen(false);
            setSearchParams({});
            fetchRestaurants();
          }}
        />
      ) : (
        <div>
          <p className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider mb-4">
            Showing {displayedRestaurants.length}{' '}
            {displayedRestaurants.length === 1 ? 'kitchen' : 'kitchens'}
            {!isAllSelected && ` for "${selectedCuisine}"`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
