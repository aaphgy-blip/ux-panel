import React from 'react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, Bike, Sparkles, MapPin } from 'lucide-react';
import { formatCurrency } from '../utils/checkoutTotals';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { setSelectedRestaurant } = useApp();

  return (
    <div
      onClick={() => setSelectedRestaurant(restaurant)}
      className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={restaurant.banner}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {restaurant.isPromo && restaurant.promoText ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD318] text-[#05268F] font-black text-[11px] shadow-md tracking-tight">
              <Sparkles className="w-3 h-3" />
              {restaurant.promoText}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-slate-800 font-bold text-[11px] shadow-sm backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-[#05268F]" />
              {restaurant.distanceKm} km
            </span>
          )}

          {/* Delivery time pill */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#05268F]/90 text-white font-bold text-[11px] shadow-md backdrop-blur-xs">
            <Clock className="w-3 h-3 text-[#FFD318]" />
            {restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} min
          </span>
        </div>

        {/* Bottom banner details: Logo & Open Status */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white shrink-0">
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white drop-shadow-md">
            <h4 className="font-extrabold text-base leading-tight drop-shadow-sm">
              {restaurant.name}
            </h4>
            <p className="text-[11px] text-slate-200 line-clamp-1">
              {restaurant.address}
            </p>
          </div>
        </div>
      </div>

      {/* Body details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {restaurant.description}
        </p>

        {/* Metrics Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
          {/* Rating */}
          <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-[#FFD318] text-[#FFD318]" />
            <span>{restaurant.rating}</span>
            <span className="text-slate-400 font-normal text-[10px]">({restaurant.ratingCount})</span>
          </div>

          {/* Delivery fee */}
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5 text-slate-400" />
            {restaurant.deliveryFee === 0 ? (
              <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                Envío Gratis
              </span>
            ) : (
              <span className="font-semibold text-slate-800">
                Envío {formatCurrency(restaurant.deliveryFee)}
              </span>
            )}
          </div>

          {/* Min order */}
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Mín. {formatCurrency(restaurant.minOrder)}
          </div>
        </div>
      </div>
    </div>
  );
};
