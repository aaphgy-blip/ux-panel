import { CartItem, Restaurant } from '../types';

export interface CheckoutBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  tip: number;
  total: number;
}

export function calculateCheckoutTotals(
  items: CartItem[],
  restaurant: Restaurant | null,
  appliedPromoCode: string | null,
  tipAmount: number = 0,
  deliveryMethod: 'delivery' | 'pickup' = 'delivery'
): CheckoutBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  let deliveryFee = 0;
  if (deliveryMethod === 'delivery' && restaurant) {
    deliveryFee = restaurant.deliveryFee;
    // Check free delivery promo
    if (appliedPromoCode === 'ENVIOGRATIS' || appliedPromoCode === 'DIRECTAURANTE') {
      deliveryFee = 0;
    }
  }

  // Transparent service fee (5% with min $0.50, max $2.00)
  const serviceFee = items.length > 0 ? Math.min(2.0, Math.max(0.5, subtotal * 0.05)) : 0;

  // Calculate discounts
  let discount = 0;
  if (appliedPromoCode === 'DIRECT10') {
    discount = Math.min(subtotal, 2.0);
  } else if (appliedPromoCode === 'PIZZA2X1') {
    discount = 3.5;
  } else if (appliedPromoCode === 'DIRECTAURANTE') {
    discount = 1.5;
  }

  const rawTotal = subtotal + deliveryFee + serviceFee + tipAmount - discount;
  const total = Math.max(0, Math.round(rawTotal * 100) / 100);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    tip: Math.round(tipAmount * 100) / 100,
    total,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
