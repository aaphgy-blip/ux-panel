import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  Bike, 
  MapPin, 
  Plus, 
  Sparkles, 
  Search,
  Phone,
  Share2
} from 'lucide-react';
import { formatCurrency } from '../utils/checkoutTotals';
import { webAlerts } from '../utils/webAlerts';

export const RestaurantDetail: React.FC = () => {
  const { selectedRestaurant, setSelectedRestaurant, openCustomizeProduct } = useApp();
  const [activeMenuCat, setActiveMenuCat] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');

  if (!selectedRestaurant) return null;

  // Extract unique categories in this restaurant's menu
  const menuCategories = Array.from(new Set(selectedRestaurant.menu.map(m => m.category)));

  // Filter items
  const filteredMenu = selectedRestaurant.menu.filter(item => {
    const matchesCategory = activeMenuCat === 'all' || item.category === activeMenuCat;
    const matchesSearch = !menuSearch || 
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
      item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedRestaurant.name,
        text: `Pide en ${selectedRestaurant.name} por Directaurante`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      webAlerts.success('Enlace copiado', 'Comparte este restaurante con tus amigos.');
    }
  };

  return (
    <div className="w-full px-4 py-3 pb-28">
      {/* Top action bar: Back button & Share */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => setSelectedRestaurant(null)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#05268F]" />
          <span>Volver al inicio</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:text-[#05268F] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            title="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md mb-6">
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden">
          <img
            src={selectedRestaurant.banner}
            alt={selectedRestaurant.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent" />

          {selectedRestaurant.isPromo && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD318] text-[#05268F] font-black text-xs shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                {selectedRestaurant.promoText}
              </span>
            </div>
          )}
        </div>

        {/* Restaurant Info Body */}
        <div className="p-5 sm:p-6 relative">
          {/* Overlapping Logo */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl -mt-16 sm:-mt-20 relative bg-white z-10 mb-3">
            <img
              src={selectedRestaurant.logo}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedRestaurant.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {selectedRestaurant.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#05268F]" />
                <span>{selectedRestaurant.address} ({selectedRestaurant.distanceKm} km de tu ubicación)</span>
              </div>
            </div>

            {/* Badges / Metrics */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-slate-900 font-extrabold text-xs">
                <Star className="w-4 h-4 fill-[#FFD318] text-[#FFD318]" />
                <span>{selectedRestaurant.rating}</span>
                <span className="text-slate-400 font-normal">({selectedRestaurant.ratingCount} reseñas)</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-100 text-[#05268F] font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>{selectedRestaurant.deliveryTimeMin} - {selectedRestaurant.deliveryTimeMax} min</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-xs">
                <Bike className="w-4 h-4 text-emerald-600" />
                <span>
                  {selectedRestaurant.deliveryFee === 0 ? 'Envío Gratis' : `Envío ${formatCurrency(selectedRestaurant.deliveryFee)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Search & Category Tabs */}
      <div className="sticky top-[108px] z-30 bg-slate-50/95 backdrop-blur-md py-3 mb-6 border-b border-slate-200/80 -mx-4 px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
            <button
              onClick={() => setActiveMenuCat('all')}
              className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeMenuCat === 'all'
                  ? 'bg-[#05268F] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              Todos los platillos ({selectedRestaurant.menu.length})
            </button>
            {menuCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveMenuCat(cat)}
                className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeMenuCat === cat
                    ? 'bg-[#05268F] text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Menu Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Buscar en el menú..."
              className="w-full pl-9 pr-3 py-1.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
            />
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            onClick={() => openCustomizeProduct(item)}
            className="group bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg transition-all duration-300 flex items-start justify-between gap-3 cursor-pointer"
          >
            <div className="flex-1 flex flex-col justify-between min-h-[110px]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#05268F] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  {item.isPopular && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#FFD318] text-[#05268F] shrink-0">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-black text-slate-900 text-base">
                    {formatCurrency(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomizeProduct(item);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#05268F] group-hover:bg-[#FFD318] group-hover:text-[#05268F] text-white font-extrabold text-xs active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            {/* Dish Photo */}
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6">
          <p className="text-sm font-bold text-slate-700">No encontramos ningún platillo con esos términos.</p>
          <button
            onClick={() => {
              setActiveMenuCat('all');
              setMenuSearch('');
            }}
            className="mt-3 text-xs font-bold text-[#05268F] hover:underline cursor-pointer"
          >
            Limpiar filtros de búsqueda
          </button>
        </div>
      )}
    </div>
  );
};
