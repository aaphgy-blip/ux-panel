import React from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS, CATEGORIES } from '../data/mockData';
import { RestaurantCard } from './RestaurantCard';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory,
    activeFilter,
    setActiveFilter
  } = useApp();

  const filteredRestaurants = RESTAURANTS.filter((rest) => {
    // Category match
    if (selectedCategory && !rest.categories.includes(selectedCategory) && rest.category !== selectedCategory) {
      return false;
    }

    // Search query match (restaurant name, category, or menu item)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = rest.name.toLowerCase().includes(q);
      const matchDesc = rest.description.toLowerCase().includes(q);
      const matchMenu = rest.menu.some(m => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchMenu) {
        return false;
      }
    }

    // Filter pill
    if (activeFilter === 'free_delivery' && rest.deliveryFee > 0) return false;
    if (activeFilter === 'top_rated' && rest.rating < 4.8) return false;
    if (activeFilter === 'fast' && rest.deliveryTimeMax > 35) return false;
    if (activeFilter === 'promo' && !rest.isPromo) return false;

    return true;
  });

  return (
    <div className="w-full px-4 py-4 pb-28 space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explorar Restaurantes & Comidas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Encuentra los mejores restaurantes directos en tu ciudad sin sobreprecios
        </p>
      </div>

      {/* Categories Grid Selector */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Categorías
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-[#05268F] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Todas
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#05268F] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'free_delivery', label: '🛵 Envío Gratis' },
          { id: 'top_rated', label: '⭐ Top Valorados (4.8+)' },
          { id: 'fast', label: '⚡ Menos de 35 min' },
          { id: 'promo', label: '🏷️ Con Descuentos' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-[#FFD318] text-[#05268F] shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-base font-bold text-slate-800">No encontramos restaurantes con esos filtros.</p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-3 text-xs font-bold text-[#05268F] hover:underline cursor-pointer"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
};
