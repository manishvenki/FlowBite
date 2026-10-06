import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Bike,
  Sparkles,
  ShoppingBag,
  Leaf,
  Info,
} from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Food } from '../types/food';
import { restaurantService } from '../services/restaurantService';
import { Rating } from '../components/common/Rating';
import { FoodCard } from '../components/food/FoodCard';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ErrorState } from '../components/common/ErrorState';
import { PageHeader } from '../components/common/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../hooks/useCart';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { totals, items } = useCart();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || searchParams.get('cuisine') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [onlyVeg, setOnlyVeg] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchRestaurantDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await restaurantService.getRestaurantById(id);
      setRestaurant(data.restaurant);
      setFoods(data.foods);
    } catch (err: any) {
      setError(err.message || 'Failed to load restaurant details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" count={1} className="h-64 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonLoader type="food" count={4} />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <ErrorState
        title="Restaurant not found"
        message={error || 'We could not find the kitchen you are looking for.'}
        onRetry={fetchRestaurantDetail}
      />
    );
  }

  // Derive unique categories from foods
  const foodCategories = Array.from(
    new Set(
      foods.map((food) => {
        if (typeof food.categoryId === 'object' && food.categoryId !== null) {
          return (food.categoryId as any).name;
        }
        return 'Specialties';
      })
    )
  );

  // Filter foods by selectedCategory & onlyVeg using robust normalized matching
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const catName =
        typeof food.categoryId === 'object' && food.categoryId !== null
          ? (food.categoryId as any).name
          : 'Specialties';

      const matchesVeg = !onlyVeg || food.isVeg;
      if (!matchesVeg) return false;

      if (!selectedCategory || selectedCategory === 'All' || selectedCategory.toLowerCase() === 'all') {
        return true;
      }

      const target = selectedCategory.trim().toLowerCase();
      const current = catName.trim().toLowerCase();
      const foodName = (food.name || '').trim().toLowerCase();

      if (current === target || current.includes(target) || target.includes(current)) {
        return true;
      }

      if (foodName.includes(target)) {
        return true;
      }

      // Check tokens for composite categories (e.g. "Biryani & Pulao" -> "biryani", "pulao")
      const targetTokens = target.split(/[&,;/+]|\band\b/).map((t) => t.trim()).filter((t) => t.length > 1);
      return targetTokens.some((tToken) => current.includes(tToken) || foodName.includes(tToken));
    });
  }, [foods, selectedCategory, onlyVeg]);

  const cartFromThisRestaurant = items.filter(
    (item) => item.restaurantId === restaurant._id
  );

  return (
    <div className="space-y-8">
      {/* Back button */}
      <PageHeader
        title=""
        showBack
        backTo="/restaurants"
        className="pb-0 mb-0 border-b-0"
      />

      {/* Restaurant Header Banner Card */}
      <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-3xl overflow-hidden shadow-card">
        <div className="relative h-60 sm:h-72 lg:h-80 w-full overflow-hidden bg-sand/30">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Status badge top right */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
                restaurant.isOpen
                  ? 'bg-[#FFFDF5]/90 text-olive-dark'
                  : 'bg-terracotta/90 text-white'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  restaurant.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-white'
                }`}
              />
              {restaurant.isOpen ? 'Open For Delivery' : 'Closed'}
            </span>
          </div>

          {/* Floating Restaurant Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-[#FFFDF5]/90 text-olive-dark text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                {restaurant.cuisine}
              </span>
              <div className="bg-[#FFFDF5]/90 text-olive-dark px-3 py-1 rounded-full backdrop-blur-sm">
                <Rating value={restaurant.rating} size="sm" />
              </div>
            </div>

            <h1 className="font-serif-title text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-sm">
              {restaurant.name}
            </h1>
          </div>
        </div>

        {/* Restaurant Info & Highlights */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-olive-dark/80 pb-4 border-b border-sand-border/60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-olive shrink-0" />
              <span className="font-medium">Delivery:</span>
              <span className="font-bold text-olive-dark">{restaurant.deliveryTime}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bike className="w-4 h-4 text-olive shrink-0" />
              <span className="font-medium">Fee:</span>
              <span className="font-bold text-olive-dark">
                {restaurant.deliveryFee === 0
                  ? 'Free Delivery'
                  : formatCurrency(restaurant.deliveryFee)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-olive shrink-0" />
              <span className="font-medium truncate max-w-sm">{restaurant.address}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-olive-dark/70 mb-1">
              About Kitchen
            </h4>
            <p className="text-sm text-olive-dark/80 leading-relaxed max-w-3xl">
              {restaurant.description}
            </p>
          </div>
        </div>
      </div>

      {/* Menu Filters: Category Tabs + Veg Toggle */}
      <div className="sticky top-20 z-30 bg-[#FFFDF5]/95 backdrop-blur-md py-4 border-b border-sand-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              selectedCategory === 'All'
                ? 'bg-olive text-[#FFFDF5] shadow-sm'
                : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/70'
            }`}
          >
            All Items ({foods.length})
          </button>
          {foodCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-olive text-[#FFFDF5] shadow-sm'
                  : 'bg-[#FAF7EE] text-olive-dark/80 hover:bg-sand/50 border border-sand-border/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Veg Only Toggle */}
        <div className="shrink-0">
          <button
            onClick={() => setOnlyVeg(!onlyVeg)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all select-none ${
              onlyVeg
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-[#FAF7EE] text-olive-dark border-sand-border hover:bg-sand/40'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Vegetarian Only</span>
          </button>
        </div>
      </div>

      {/* Foods Grid */}
      {filteredFoods.length === 0 ? (
        <div className="p-8 text-center bg-[#FAF7EE] rounded-2xl border border-sand-border text-olive-dark/70">
          <p className="font-semibold text-sm">No items found in this section</p>
          <p className="text-xs mt-1">Try switching to all items or disabling the vegetarian filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              restaurant={{
                _id: restaurant._id,
                name: restaurant.name,
                deliveryFee: restaurant.deliveryFee,
                isOpen: restaurant.isOpen,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating Cart Bar if active items */}
      {totals.itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-olive text-[#FFFDF5] rounded-2xl p-4 shadow-modal flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80">
                  {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} in your cart
                </p>
                <p className="text-base font-bold font-serif-title">
                  Total: {formatCurrency(totals.grandTotal)}
                </p>
              </div>
            </div>

            <Link
              to="/cart"
              className="px-5 py-2.5 rounded-xl bg-[#FFFDF5] text-olive-dark font-bold text-xs sm:text-sm hover:bg-sand transition-all shadow-subtle"
            >
              View Order Cart
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
