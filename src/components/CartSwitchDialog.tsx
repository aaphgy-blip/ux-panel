import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartSwitchDialog: React.FC = () => {
  const { pendingCartItem, cartRestaurant, confirmCartSwitch, cancelCartSwitch } = useApp();

  if (!pendingCartItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          ¿Deseas cambiar de restaurante?
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Ya tienes platillos de <strong>{cartRestaurant?.name || 'otro restaurante'}</strong> en tu carrito. Solo es posible pedir de un restaurante a la vez para garantizar una entrega rápida y caliente.
        </p>

        <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-[#05268F] shrink-0" />
          <span>
            Si continúas, vaciaremos tu carrito anterior y agregaremos <strong>{pendingCartItem.product.name}</strong>.
          </span>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={confirmCartSwitch}
            className="w-full py-3 px-4 rounded-2xl bg-[#05268F] hover:bg-[#031B66] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span>Crear nuevo pedido</span>
            <ArrowRight className="w-4 h-4 text-[#FFD318]" />
          </button>

          <button
            onClick={cancelCartSwitch}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm active:scale-98 transition-all cursor-pointer"
          >
            Mantener carrito actual
          </button>
        </div>
      </div>
    </div>
  );
};
