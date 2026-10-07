import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles,
  Bike
} from 'lucide-react';
import { formatCurrency, calculateCheckoutTotals } from '../utils/checkoutTotals';
import { webAlerts } from '../utils/webAlerts';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartRestaurant, 
    updateCartItemQuantity, 
    removeFromCart, 
    clearCart,
    appliedPromoCode,
    setAppliedPromoCode,
    setIsCheckoutOpen,
    setSelectedRestaurant
  } = useApp();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const totals = calculateCheckoutTotals(cart, cartRestaurant, appliedPromoCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (['DIRECTAURANTE', 'ENVIOGRATIS', 'DIRECT10', 'PIZZA2X1'].includes(cleanCode)) {
      setAppliedPromoCode(cleanCode);
      webAlerts.success('¡Cupón aplicado!', `El cupón ${cleanCode} se aplicó correctamente.`);
      setCouponInput('');
    } else {
      webAlerts.warning('Cupón no válido', 'Prueba con DIRECTAURANTE, ENVIOGRATIS o DIRECT10');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#05268F] text-[#FFD318] flex items-center justify-center font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Mi Carrito
              </h3>
              {cartRestaurant ? (
                <button
                  onClick={() => {
                    setSelectedRestaurant(cartRestaurant);
                    setIsCartOpen(false);
                  }}
                  className="text-xs text-[#05268F] font-bold hover:underline line-clamp-1 cursor-pointer text-left"
                >
                  {cartRestaurant.name}
                </button>
              ) : (
                <span className="text-xs text-slate-500">Sin productos aún</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                title="Vaciar carrito"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
              <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-black text-slate-800">
              Tu carrito está vacío
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Explora nuestros restaurantes aliados y agrega deliciosos platillos sin sobrecostos.
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-5 px-5 py-2.5 rounded-2xl bg-[#05268F] text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Explorar Restaurantes
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Free Delivery Promo Bar */}
            {totals.deliveryFee === 0 && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold">
                <Bike className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>¡Genial! Este pedido califica para <strong>Envío Gratis</strong>.</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-xs hover:border-slate-300 transition-all flex items-start justify-between gap-3"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug truncate">
                      {item.product.name}
                    </h4>

                    {/* Options list */}
                    {item.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {item.selectedOptions.map((o) => o.optionName).join(', ')}
                      </p>
                    )}

                    {/* Special instructions */}
                    {item.specialInstructions && (
                      <p className="text-[11px] text-[#05268F] italic mt-0.5 line-clamp-1">
                        "{item.specialInstructions}"
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="font-black text-sm text-[#05268F]">
                        {formatCurrency(item.totalPrice)}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                          aria-label="Menos"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-black text-xs text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
                          aria-label="Más"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Eliminar platillo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código promocional..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#05268F] text-white font-extrabold text-xs active:scale-95 cursor-pointer"
                >
                  Aplicar
                </button>
              </form>

              {appliedPromoCode && (
                <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-[#05268F] font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#05268F]" />
                    <span>Cupón activo: <strong>{appliedPromoCode}</strong></span>
                  </div>
                  <button
                    onClick={() => setAppliedPromoCode(null)}
                    className="text-slate-400 hover:text-rose-500 text-[11px] underline cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} platillos)</span>
                <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Costo de envío</span>
                <span className={`font-bold ${totals.deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {totals.deliveryFee === 0 ? 'Gratis' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tarifa de servicio Directaurante</span>
                <span className="font-bold text-slate-900">{formatCurrency(totals.serviceFee)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Descuento aplicado</span>
                  <span>-{formatCurrency(totals.discount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total a pagar</span>
                <span className="text-[#05268F] text-base">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Sticky Footer */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-100 shadow-xl shrink-0">
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#05268F] hover:bg-[#031B66] text-white font-extrabold text-sm flex items-center justify-between shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <span>Ir al Checkout</span>
              <div className="flex items-center gap-2">
                <span className="bg-[#FFD318] text-[#05268F] px-2.5 py-0.5 rounded-xl font-black text-xs">
                  {formatCurrency(totals.total)}
                </span>
                <ArrowRight className="w-4 h-4 text-[#FFD318]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
