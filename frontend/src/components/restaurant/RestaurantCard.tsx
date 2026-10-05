import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bike } from 'lucide-react';
import { Restaurant } from '../../types/restaurant';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';

export interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="group flex flex-col bg-[#FFFDF5] border border-sand-border/80 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Restaurant Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-sand/40">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

        {/* Open / Closed Status Badge */}
        <div className="absolute top-3 right-3">
          {restaurant.isOpen ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FFFDF5]/90 text-olive-dark backdrop-blur-sm border border-sand-border/80 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Open Now
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-terracotta/90 text-white backdrop-blur-sm shadow-sm">
              Closed
            </span>
          )}
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 left-3 bg-[#FFFDF5]/95 backdrop-blur-sm px-2.5 py-1 rounded-xl shadow-subtle border border-sand-border/60">
          <Rating value={restaurant.rating} size="sm" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif-title text-lg sm:text-xl font-bold text-olive-dark group-hover:text-olive transition-colors leading-tight">
            {restaurant.name}
          </h3>

          <p className="text-xs text-olive-dark/70 font-medium mt-1 line-clamp-1">
            {restaurant.cuisine}
          </p>

          <p className="text-xs text-olive-dark/60 mt-2 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        </div>

        {/* Delivery info footer */}
        <div className="pt-4 mt-4 border-t border-sand-border/60 flex items-center justify-between text-xs text-olive-dark/80">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-olive" />
            <span>{restaurant.deliveryTime}</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Bike className="w-3.5 h-3.5 text-olive" />
            <span>
              {restaurant.deliveryFee === 0
                ? 'Free Delivery'
                : `${formatCurrency(restaurant.deliveryFee)} delivery`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
