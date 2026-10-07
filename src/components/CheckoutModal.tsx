import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Bike, 
  ShoppingBag, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  HeartHandshake, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, calculateCheckoutTotals } from '../utils/checkoutTotals';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartRestaurant, 
    selectedAddress, 
    setIsAddressModalOpen,
    appliedPromoCode,
    placeOrder
  } = useApp();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [cashAmount, setCashAmount] = useState<string>('');
  const [tipAmount, setTipAmount] = useState<number>(1.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen || cart.length === 0 || !cartRestaurant) return null;

  const totals = calculateCheckoutTotals(cart, cartRestaurant, appliedPromoCode, tipAmount, deliveryMethod);

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#05268F', '#FFD318', '#38BDF8', '#10B981'],
      });
    } catch {
      // Ignore confetti issues
    }

    setTimeout(async () => {
      let paymentDesc = 'Efectivo';
      if (paymentMethod === 'card') paymentDesc = 'Tarjeta de Crédito / Débito';
      else if (paymentMethod === 'digital') paymentDesc = 'Pago Digital (Nequi / PSE)';
      else if (cashAmount) paymentDesc = `Efectivo (Paga con $${cashAmount})`;

      await placeOrder(paymentDesc, tipAmount, deliveryMethod);
      setIsSubmitting(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-2xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
              Checkout & Confirmación
            </h3>
            <p className="text-xs text-slate-500">
              Pedido en <strong>{cartRestaurant.name}</strong>
            </p>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. Modalidad de Entrega */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                deliveryMethod === 'delivery'
                  ? 'border-[#05268F] bg-blue-50/60 shadow-xs font-black text-[#05268F]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                deliveryMethod === 'delivery' ? 'bg-[#05268F] text-[#FFD318]' : 'bg-slate-100 text-slate-600'
              }`}>
                <Bike className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm block">A Domicilio</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {cartRestaurant.deliveryTimeMin}-{cartRestaurant.deliveryTimeMax} min
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                deliveryMethod === 'pickup'
                  ? 'border-[#05268F] bg-blue-50/60 shadow-xs font-black text-[#05268F]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                deliveryMethod === 'pickup' ? 'bg-[#05268F] text-[#FFD318]' : 'bg-slate-100 text-slate-600'
              }`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs sm:text-sm block">Para Recoger</span>
                <span className="text-[10px] text-slate-500 font-normal">Sin costo de envío</span>
              </div>
            </button>
          </div>

          {/* 2. Dirección de Entrega (if delivery) */}
          {deliveryMethod === 'delivery' && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#05268F]" />
                  <span className="text-xs font-extrabold text-slate-900">Dirección de entrega</span>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-xs text-[#05268F] font-bold hover:underline cursor-pointer"
                >
                  Cambiar
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    {selectedAddress.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedAddress.tag.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 font-medium">
                  {selectedAddress.fullAddress}
                </p>
                {selectedAddress.details && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedAddress.details}
                  </p>
                )}
                {selectedAddress.deliveryInstructions && (
                  <p className="text-[11px] text-[#05268F] italic mt-1 bg-blue-50/50 p-1.5 rounded-lg">
                    Nota: {selectedAddress.deliveryInstructions}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3. Método de Pago */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 mb-2.5">
              Método de Pago
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-[#05268F] bg-blue-50/60 font-bold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold">Efectivo</div>
                  <div className="text-[10px] text-slate-500">Contra entrega</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#05268F] bg-blue-50/60 font-bold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#05268F] shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold">Tarjeta</div>
                  <div className="text-[10px] text-slate-500">Datáfono o en línea</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('digital')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  paymentMethod === 'digital'
                    ? 'border-[#05268F] bg-blue-50/60 font-bold text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-extrabold">Pago Digital</div>
                  <div className="text-[10px] text-slate-500">Nequi / PSE / QR</div>
                </div>
              </button>
            </div>

            {/* Cash note */}
            {paymentMethod === 'cash' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="¿Con cuánto vas a pagar? (Para que el repartidor lleve cambio)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                />
              </div>
            )}
          </div>

          {/* 4. Propina para el Repartidor */}
          {deliveryMethod === 'delivery' && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  <span>Propina 100% para tu repartidor</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800">Opcional</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1.0, 1.5, 2.5].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTipAmount(amt)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      tipAmount === amt
                        ? 'bg-[#05268F] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    {amt === 0 ? 'Sin propina' : `$${amt.toFixed(2)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Resumen de Pago */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">{formatCurrency(totals.subtotal)}</span>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-slate-600">
                <span>Costo de envío</span>
                <span className={`font-bold ${totals.deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {totals.deliveryFee === 0 ? 'Gratis' : formatCurrency(totals.deliveryFee)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Tarifa de servicio</span>
              <span className="font-bold text-slate-900">{formatCurrency(totals.serviceFee)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Descuento cupón</span>
                <span>-{formatCurrency(totals.discount)}</span>
              </div>
            )}
            {tipAmount > 0 && deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-amber-700 font-bold">
                <span>Propina al repartidor</span>
                <span>+{formatCurrency(tipAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
              <span>Total final a pagar</span>
              <span className="text-[#05268F]">{formatCurrency(totals.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Transacción directa sin comisiones ocultas ni cobros sorpresa.</span>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 bg-white border-t border-slate-100 shadow-xl shrink-0">
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#05268F] hover:bg-[#031B66] text-white font-extrabold text-sm flex items-center justify-between shadow-lg active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{isSubmitting ? 'Procesando tu pedido...' : 'Confirmar y Pagar Pedido'}</span>
            <div className="flex items-center gap-2">
              <span className="bg-[#FFD318] text-[#05268F] px-2.5 py-0.5 rounded-xl font-black text-xs">
                {formatCurrency(totals.total)}
              </span>
              <ArrowRight className="w-4 h-4 text-[#FFD318]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
