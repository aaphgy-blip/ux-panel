/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryCarousel } from './components/CategoryCarousel';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetail } from './components/RestaurantDetail';
import { SecondaryPartnerAccess } from './components/SecondaryPartnerAccess';
import { ExploreView } from './components/ExploreView';
import { MyOrders } from './components/MyOrders';
import { UserProfile } from './components/UserProfile';
import { ProductCustomizeModal } from './components/ProductCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { CartSwitchDialog } from './components/CartSwitchDialog';
import { CheckoutModal } from './components/CheckoutModal';
import { AddressesManager } from './components/AddressesManager';
import { NotificationCenter } from './components/NotificationCenter';
import { PartnerRegistrationModal } from './components/PartnerRegistrationModal';
import { ToastContainer } from './components/ToastContainer';
import { BottomNav } from './components/BottomNav';
import { RESTAURANTS } from './data/mockData';
import { Store } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedRestaurant, 
    selectedCategory, 
    searchQuery, 
    activeFilter, 
    setActiveFilter 
  } = useApp();

  // Filter restaurants on Home view
  const filteredHomeRestaurants = RESTAURANTS.filter((rest) => {
    if (selectedCategory && !rest.categories.includes(selectedCategory) && rest.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = rest.name.toLowerCase().includes(q);
      const matchDesc = rest.description.toLowerCase().includes(q);
      const matchMenu = rest.menu.some(m => m.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchMenu) return false;
    }
    if (activeFilter === 'free_delivery' && rest.deliveryFee > 0) return false;
    if (activeFilter === 'top_rated' && rest.rating < 4.8) return false;
    if (activeFilter === 'fast' && rest.deliveryTimeMax > 35) return false;
    if (activeFilter === 'promo' && !rest.isPromo) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col justify-start items-center antialiased selection:bg-[#FFD318] selection:text-[#05268F]">
      {/* Toast Alert Container for in-app non-intrusive mobile alerts */}
      <ToastContainer />

      {/* Main Mobile/Tablet Device Container */}
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-3xl min-h-screen bg-[#F8FAFC] flex flex-col shadow-sm relative">
        {/* Sticky Mobile Header */}
        <Header />

        {/* Main View Router */}
        <main className="flex-1 w-full pb-20 sm:pb-24">
          {selectedRestaurant ? (
            <RestaurantDetail />
          ) : activeTab === 'home' ? (
            <div>
              {/* Infinite Category Carousel */}
              <CategoryCarousel />

              {/* Filter Chips Bar */}
              <div className="px-4 py-2.5">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  {[
                    { id: 'all', label: 'Todos' },
                    { id: 'free_delivery', label: '🛵 Envío Gratis' },
                    { id: 'top_rated', label: '⭐ Mejor Calificados (4.8+)' },
                    { id: 'fast', label: '⚡ Menos de 35 min' },
                    { id: 'promo', label: '🏷️ Ofertas Directas' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                        activeFilter === f.id
                          ? 'bg-[#05268F] text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Restaurants Section */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#05268F] flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        Restaurantes Disponibles
                      </h2>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {filteredHomeRestaurants.length} opciones
                  </span>
                </div>

                {/* Grid of Restaurant Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredHomeRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>

                {filteredHomeRestaurants.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 my-4">
                    <p className="text-sm font-bold text-slate-700">No encontramos ningún restaurante con esos filtros.</p>
                    <button
                      onClick={() => setActiveFilter('all')}
                      className="mt-3 text-xs font-bold text-[#05268F] hover:underline cursor-pointer"
                    >
                      Ver todos los restaurantes
                    </button>
                  </div>
                )}
              </div>

              {/* Secondary Partner Access: Registrar mi restaurante / Ser repartidor */}
              <SecondaryPartnerAccess />
            </div>
          ) : activeTab === 'explore' ? (
            <ExploreView />
          ) : activeTab === 'orders' ? (
            <MyOrders />
          ) : activeTab === 'profile' ? (
            <UserProfile />
          ) : null}
        </main>

        {/* Floating Modals and Sheets */}
        <ProductCustomizeModal />
        <CartDrawer />
        <CartSwitchDialog />
        <CheckoutModal />
        <AddressesManager />
        <NotificationCenter />
        <PartnerRegistrationModal />

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
