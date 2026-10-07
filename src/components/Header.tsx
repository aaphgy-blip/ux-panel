import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  Bell, 
  ChevronDown,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedAddress,
    setIsAddressModalOpen,
    cart,
    setIsCartOpen,
    unreadNotifsCount,
    setIsNotifCenterOpen,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    setSelectedRestaurant,
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoClick = () => {
    setSelectedRestaurant(null);
    setActiveTab('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all pt-safe">
      {/* Mobile / Tablet App Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 group cursor-pointer text-left shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#05268F] flex items-center justify-center text-white font-black text-lg shadow-sm border-2 border-[#FFD318]">
            <span className="text-[#FFD318]">D</span>
          </div>
          <div>
            <span className="font-black text-base sm:text-lg text-[#05268F] tracking-tight block leading-tight">
              DIRECTAURANTE
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block -mt-0.5">
              Client App
            </span>
          </div>
        </button>

        {/* Address Selector Pill for Tablet & Desktop */}
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-medium border border-slate-200/70 transition-colors max-w-xs truncate cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-[#05268F]/10 flex items-center justify-center shrink-0">
            <MapPin className="w-3 h-3 text-[#05268F]" />
          </div>
          <div className="truncate text-left">
            <span className="text-slate-500 text-[10px] block leading-none font-semibold">Entregar en:</span>
            <span className="font-bold text-slate-900 truncate block text-xs">
              {selectedAddress.title} • {selectedAddress.fullAddress}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </button>

        {/* Right Action Icons: Notifications & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Notifications */}
          <button
            onClick={() => setIsNotifCenterOpen(true)}
            className="relative p-2 rounded-full text-slate-700 hover:text-[#05268F] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FFD318] text-[#05268F] font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#05268F] text-white hover:bg-[#031B66] active:scale-95 transition-all shadow-xs font-bold text-xs cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#FFD318]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-[#FFD318] text-[#05268F] font-black text-[10px] rounded-full flex items-center justify-center border border-[#05268F]">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Carrito</span>
          </button>
        </div>
      </div>

      {/* Address & Search Bar for Mobile */}
      <div className="max-w-4xl mx-auto px-4 pb-2.5 flex flex-col gap-2">
        {/* Mobile Address Pill */}
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="sm:hidden flex items-center justify-between w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 active:bg-slate-100"
        >
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#05268F] shrink-0" />
            <span className="text-slate-500 font-semibold text-[11px]">Entregar en:</span>
            <span className="font-bold text-slate-900 truncate">
              {selectedAddress.title} • {selectedAddress.fullAddress}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar hamburguesas, pizzas o restaurantes..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-100 border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05268F] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
