import React from 'react';
import { Plus } from 'lucide-react';
import { Food } from '../../types/food';
import { Badge } from '../common/Badge';
import { QuantitySelector } from '../common/QuantitySelector';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useToast } from '../../hooks/useToast';

export interface FoodCardProps {
  food: Food;
  restaurant: {
    _id: string;
    name: string;
    deliveryFee: number;
    isOpen?: boolean;
  };
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, restaurant }) => {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { success, info } = useToast();

  const cartItem = items.find((item) => item.food._id === food._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (restaurant.isOpen === false) {
      info('This restaurant is currently closed for orders');
      return;
    }
    addItem(food, {
      _id: restaurant._id,
      name: restaurant.name,
      deliveryFee: restaurant.deliveryFee,
    });
    success(`Added ${food.name} to cart`);
  };

  const handleIncrement = () => {
    updateQuantity(food._id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeItem(food._id);
    } else {
      updateQuantity(food._id, quantity - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 sm:p-5 bg-[#FFFDF5] border border-sand-border/80 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-200">
      {/* Food Details */}
      <div className="flex-1 flex flex-col justify-between order-2 sm:order-1">
        <div>
          {/* Veg / Non-Veg Indicator & Availability */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={food.isVeg ? 'veg' : 'nonveg'} size="sm">
              {food.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>

            {!food.isAvailable && (
              <Badge variant="neutral" size="sm">
                Sold Out
              </Badge>
            )}
          </div>

          <h4 className="font-serif-title text-base sm:text-lg font-bold text-olive-dark leading-snug">
            {food.name}
          </h4>

          <p className="text-xs sm:text-sm text-olive-dark/70 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Price & Cart Action */}
        <div className="pt-3 mt-3 flex items-center justify-between">
          <span className="font-bold text-base sm:text-lg text-olive-dark">
            {formatCurrency(food.price)}
          </span>

          {quantity > 0 ? (
            <QuantitySelector
              quantity={quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              size="sm"
            />
          ) : (
            <button
              onClick={handleAdd}
              disabled={!food.isAvailable || restaurant.isOpen === false}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sand/60 hover:bg-olive hover:text-[#FFFDF5] text-olive-dark text-xs font-bold border border-sand-border hover:border-olive transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Food Image */}
      <div className="relative w-full sm:w-32 h-36 sm:h-32 rounded-xl overflow-hidden bg-sand/30 shrink-0 order-1 sm:order-2">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/60 px-2 py-1 rounded">
              Unavailable
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
