import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';
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

export const RestaurantsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCuisine = searchParams.get('cuisine') || 'All';

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [onlyOpen, setOnlyOpen] = useState(false);

  useEffect(() => {
    categoryService
      .getCategories()
      .then(setCategories)
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getRestaurants({
        search: searchTerm.trim() || undefined,
        cuisine: selectedCuisine !== 'All' ? selectedCuisine : undefined,
        isOpen: onlyOpen ? true : undefined,
      });
      setRestaurants(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCuisine, onlyOpen]);

  const handleSearchSubmit = (val: string) => {
    setSearchParams((prev) => {
      if (val.trim()) {
        prev.set('search', val.trim());
      } else {
        prev.delete('search');
      }
      return prev;
    });
    fetchRestaurants();
  };

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisine(cuisine);
    setSearchParams((prev) => {
      if (cuisine === 'All') {
        prev.delete('cuisine');
      } else {
        prev.set('cuisine', cuisine);
      }
      return prev;
    });
  };

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
                  prev.delete('search');
                  return prev;
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
            selectedCuisine === 'All'
              ? 'bg-olive text-[#FFFDF5] shadow-sm'
              : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/80'
          }`}
        >
          All Cuisines
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCuisineChange(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              selectedCuisine === cat.name
                ? 'bg-olive text-[#FFFDF5] shadow-sm'
                : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Restaurant Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="restaurant" count={6} />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchRestaurants} />
      ) : restaurants.length === 0 ? (
        <EmptyState
          title="No kitchens found"
          description="We couldn't find any restaurants matching your current search or filters. Try adjusting your criteria or search term."
          actionText="Reset All Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCuisine('All');
            setOnlyOpen(false);
            setSearchParams({});
            restaurantService.getRestaurants().then(setRestaurants);
          }}
        />
      ) : (
        <div>
          <p className="text-xs font-semibold text-olive-dark/60 uppercase tracking-wider mb-4">
            Showing {restaurants.length} {restaurants.length === 1 ? 'kitchen' : 'kitchens'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
