import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Category } from '../types/category';
import { Food } from '../types/food';
import { restaurantService } from '../services/restaurantService';
import { categoryService } from '../services/categoryService';
import { foodService } from '../services/foodService';
import { SearchBar } from '../components/common/SearchBar';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { CategoryCard } from '../components/restaurant/CategoryCard';
import { FoodCard } from '../components/food/FoodCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useLocationArea } from '../context/LocationContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { area, openLocationModal } = useLocationArea();

  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, rests, foods] = await Promise.all([
        categoryService.getCategories(),
        restaurantService.getRestaurants(),
        foodService.getFoods({ limit: 4 }),
      ]);
      setCategories(cats);
      setRestaurants(rests);
      setPopularFoods(foods);
    } catch (err: any) {
      setError(err.message || 'Failed to load home page content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    navigate(`/restaurants?cuisine=${encodeURIComponent(categoryName)}`);
  };

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  const featuredRestaurants = restaurants.slice(0, 3);
  const recommendedRestaurants = restaurants.slice(3, 6);

  const defaultAddr = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];

  return (
    <div className="space-y-14 md:space-y-20">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-sand/40 border border-sand-border/80 overflow-hidden px-6 py-12 md:py-16 lg:px-12">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-olive/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 translate-y-12 w-64 h-64 bg-terracotta/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF5] border border-sand-border text-xs font-semibold text-olive-dark shadow-subtle mb-5">
            <Sparkles className="w-3.5 h-3.5 text-olive" />
            <span>Order. Prepare. Deliver.</span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold text-olive-dark leading-[1.15] tracking-tight">
            Mindful dining, <br />
            <span className="text-olive">crafted for your table.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-olive-dark/75 mt-4 max-w-xl leading-relaxed">
            Discover artisanal neighborhood kitchens and freshly cooked dishes delivered warm in sustainable packaging.
          </p>

          {/* Quick Location + Search Bar */}
          <div className="mt-8 space-y-4">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearchSubmit}
              placeholder="Search dishes, restaurants or cuisines (e.g. Biryani, Masala Dosa, Paneer Tikka)..."
            />

            <div className="flex flex-wrap items-center gap-2 text-xs text-olive-dark/70 pt-1">
              <span className="font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-olive" />
                Delivering to:
              </span>
              <span className="font-semibold text-olive-dark">
                {defaultAddr ? `${defaultAddr.street}, ${defaultAddr.city}` : `📍 ${area}, Bengaluru`}
              </span>
              <span className="text-sand-border">•</span>
              <button
                type="button"
                onClick={openLocationModal}
                className="text-olive underline font-medium hover:text-olive-dark cursor-pointer"
              >
                Change area
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Carousel */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-olive-dark">
              Explore Cuisines
            </h2>
            <p className="text-xs md:text-sm text-olive-dark/70 mt-0.5">
              Select from curated culinary specialties
            </p>
          </div>
          <Link
            to="/restaurants"
            className="text-xs md:text-sm font-semibold text-olive hover:text-olive-dark inline-flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            <SkeletonLoader type="category" count={6} />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                onClick={() => handleCategorySelect(cat.name)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Restaurants */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-olive/10 flex items-center justify-center text-olive">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-olive-dark">
                Featured Kitchens
              </h2>
              <p className="text-xs md:text-sm text-olive-dark/70 mt-0.5">
                Top rated dining spots with consistent quality
              </p>
            </div>
          </div>
          <Link
            to="/restaurants"
            className="hidden sm:inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-olive hover:text-olive-dark group"
          >
            <span>See more kitchens</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonLoader type="restaurant" count={3} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Section - Olive & Sand Banner */}
      <section className="relative rounded-3xl bg-[#3F4933] text-[#FFFDF5] p-8 sm:p-10 md:p-12 overflow-hidden shadow-card">
        <div className="relative z-10 max-w-xl space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#68734F] text-[#FFFDF5] uppercase tracking-wider inline-block">
            Mindful Dining Club
          </span>
          <h2 className="font-serif-title text-2xl sm:text-4xl font-bold leading-tight">
            Order artisan food with zero compromise on quality.
          </h2>
          <p className="text-xs sm:text-sm text-[#FFFDF5]/80 leading-relaxed">
            Every dish on BiteFlow is prepared fresh upon order by independent chefs. Savor meals crafted with local ingredients.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/restaurants')}
              icon={<Compass className="w-4 h-4" />}
            >
              Explore Restaurants
            </Button>
            {!user && (
              <Button
                variant="outline"
                className="text-[#FFFDF5] border-white/30 hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                Join BiteFlow Free
              </Button>
            )}
          </div>
        </div>

        {/* Decorative corner icon */}
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
          <Sparkles className="w-80 h-80 text-white" />
        </div>
      </section>

      {/* Popular Foods */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-olive-dark">
                Popular Dishes This Week
              </h2>
              <p className="text-xs md:text-sm text-olive-dark/70 mt-0.5">
                Loved by local diners for lunch and dinner
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonLoader type="food" count={4} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularFoods.map((food) => {
              const restObj = typeof food.restaurantId === 'object' ? food.restaurantId : null;
              const restaurantInfo = {
                _id: restObj?._id || (food.restaurantId as string),
                name: restObj?.name || 'Artisan Kitchen',
                deliveryFee: restObj?.deliveryFee || 2.49,
                isOpen: true,
              };

              return (
                <FoodCard
                  key={food._id}
                  food={food}
                  restaurant={restaurantInfo}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Recommended Restaurants Section */}
      {recommendedRestaurants.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-olive-dark">
                Recommended For You
              </h2>
              <p className="text-xs md:text-sm text-olive-dark/70 mt-0.5">
                Chef specialties handpicked for your taste
              </p>
            </div>
            <Link
              to="/restaurants"
              className="text-xs md:text-sm font-semibold text-olive hover:text-olive-dark"
            >
              Browse All ({restaurants.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
