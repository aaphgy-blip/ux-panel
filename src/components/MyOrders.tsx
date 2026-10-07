import React from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Phone, 
  RotateCcw, 
  ChevronRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { formatCurrency } from '../utils/checkoutTotals';
import { webAlerts } from '../utils/webAlerts';

export const MyOrders: React.FC = () => {
  const { orders, reorder, viewingOrder, setViewingOrder, setActiveTab } = useApp();

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 1;
      case 'preparing': return 2;
      case 'on_the_way': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const handleCallDriver = (phone: string, driverName: string) => {
    webAlerts.info('Llamada en curso', `Contactando a ${driverName} al ${phone}...`);
  };

  return (
    <div className="w-full px-4 py-4 pb-28 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mis Pedidos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rastrea tus entregas en tiempo real o repite tus platos favoritos
          </p>
        </div>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Pedidos en curso ({activeOrders.length})
            </h2>
          </div>

          {activeOrders.map((order) => {
            const step = getStatusStep(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-2 border-[#05268F]/30 p-5 sm:p-6 shadow-md overflow-hidden relative"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={order.restaurant.logo}
                        alt={order.restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#05268F] bg-blue-50 px-2 py-0.5 rounded-md">
                        {order.orderNumber}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-0.5">
                        {order.restaurant.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD318] text-[#05268F] font-black text-xs shadow-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Llegada estimada: {order.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>

                {/* Real-time Status Tracker */}
                <div className="py-5">
                  <div className="grid grid-cols-4 gap-2 text-center relative">
                    {/* Connecting line */}
                    <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0">
                      <div
                        className="h-full bg-[#05268F] transition-all duration-500"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      />
                    </div>

                    {/* Step 1: Recibido */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= 1 ? 'bg-[#05268F] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">Recibido</span>
                    </div>

                    {/* Step 2: Cocinando */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= 2 ? 'bg-[#05268F] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <ChefHat className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">Cocinando</span>
                    </div>

                    {/* Step 3: En camino */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= 3 ? 'bg-[#05268F] text-[#FFD318] shadow-md ring-4 ring-yellow-200' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Bike className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">En camino</span>
                    </div>

                    {/* Step 4: Entregado */}
                    <div className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        step >= 4 ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1.5">Entregado</span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-slate-600 font-semibold mt-3">
                    {order.statusText}
                  </p>
                </div>

                {/* Driver Card if on the way */}
                {order.driver && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-[#05268F]">
                        <img
                          src={order.driver.photo}
                          alt={order.driver.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                            {order.driver.name}
                          </h4>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md">
                            ★ {order.driver.rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {order.driver.vehicle} • Placa {order.driver.plate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCallDriver(order.driver!.phone, order.driver!.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#05268F] text-white font-bold text-xs hover:bg-[#031B66] active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FFD318]" />
                      <span className="hidden sm:inline">Llamar</span>
                    </button>
                  </div>
                )}

                {/* Items & Address Summary */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </span>
                  </div>
                  <div className="font-black text-slate-900 text-sm">
                    Total: {formatCurrency(order.total)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past Orders Section */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
          Historial de Pedidos Anteriores
        </h2>

        {pastOrders.length === 0 && activeOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">Aún no tienes pedidos registrados</h3>
            <p className="text-xs text-slate-500 mt-1">
              Explora tus restaurantes favoritos y haz tu primer pedido en Directaurante.
            </p>
            <button
              onClick={() => setActiveTab('home')}
              className="mt-4 px-5 py-2.5 rounded-2xl bg-[#05268F] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Explorar Menú
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={order.restaurant.logo}
                      alt={order.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                        {order.restaurant.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Entregado
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {order.createdAt} • {order.items.length} productos
                    </p>
                    <p className="text-xs text-slate-700 font-semibold mt-1 line-clamp-1">
                      {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-black text-sm text-slate-900">
                    {formatCurrency(order.total)}
                  </span>

                  <button
                    onClick={() => reorder(order)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#FFD318] hover:text-[#05268F] text-slate-800 font-bold text-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#05268F]" />
                    <span>Repetir pedido</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
