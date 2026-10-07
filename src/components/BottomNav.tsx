import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Compass, 
  ShoppingBag, 
  Clock, 
  User 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setSelectedRestaurant, 
    cart, 
    setIsCartOpen,
    activeOrder 
  } = useApp();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleTabClick = (tab: 'home' | 'explore' | 'orders' | 'profile') => {
    setSelectedRestaurant(null);
    setActiveTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md sm:max-w-2xl lg:max-w-3xl mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Inicio */}
        <button
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#05268F] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-blue-50 text-[#05268F]' : ''}`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        {/* Explorar */}
        <button
          onClick={() => handleTabClick('explore')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'explore'
              ? 'text-[#05268F] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'explore' ? 'bg-blue-50 text-[#05268F]' : ''}`}>
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Explorar</span>
        </button>

        {/* Carrito / Mi Pedido */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative text-slate-500 hover:text-slate-800"
        >
          <div className="relative p-1">
            <ShoppingBag className="w-5 h-5 text-[#05268F]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#FFD318] text-[#05268F] font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Carrito</span>
        </button>

        {/* Mis Pedidos */}
        <button
          onClick={() => handleTabClick('orders')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer relative ${
            activeTab === 'orders'
              ? 'text-[#05268F] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`relative p-1 rounded-xl ${activeTab === 'orders' ? 'bg-blue-50 text-[#05268F]' : ''}`}>
            <Clock className="w-5 h-5" />
            {activeOrder && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-0.5">Pedidos</span>
        </button>

        {/* Perfil */}
        <button
          onClick={() => handleTabClick('profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#05268F] font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1 rounded-xl ${activeTab === 'profile' ? 'bg-blue-50 text-[#05268F]' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
