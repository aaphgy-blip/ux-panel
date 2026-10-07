import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CartItemOption, CartItem } from '../types';
import { X, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../utils/checkoutTotals';

export const ProductCustomizeModal: React.FC = () => {
  const { customizingProduct, closeCustomizeProduct, addToCart, selectedRestaurant } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<CartItemOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reset when product changes
  useEffect(() => {
    if (customizingProduct) {
      setQuantity(1);
      setSpecialInstructions('');
      
      // Auto-select first option for required groups
      const initialOpts: CartItemOption[] = [];
      if (customizingProduct.optionGroups) {
        customizingProduct.optionGroups.forEach((group) => {
          if (group.required && group.options.length > 0) {
            const first = group.options[0];
            initialOpts.push({
              groupId: group.id,
              groupName: group.name,
              optionId: first.id,
              optionName: first.name,
              priceDelta: first.priceDelta,
            });
          }
        });
      }
      setSelectedOptions(initialOpts);
    }
  }, [customizingProduct]);

  if (!customizingProduct) return null;

  // Calculate unit and total price
  const optionsDelta = selectedOptions.reduce((sum, opt) => sum + opt.priceDelta, 0);
  const unitPrice = customizingProduct.price + optionsDelta;
  const totalPrice = unitPrice * quantity;

  const handleSelectRadioOption = (groupId: string, groupName: string, optionId: string, optionName: string, priceDelta: number) => {
    setSelectedOptions((prev) => {
      // Remove any existing option from this group
      const filtered = prev.filter((o) => o.groupId !== groupId);
      return [...filtered, { groupId, groupName, optionId, optionName, priceDelta }];
    });
  };

  const handleToggleCheckboxOption = (groupId: string, groupName: string, optionId: string, optionName: string, priceDelta: number) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.optionId === optionId);
      if (exists) {
        return prev.filter((o) => o.optionId !== optionId);
      } else {
        return [...prev, { groupId, groupName, optionId, optionName, priceDelta }];
      }
    });
  };

  const handleConfirmAddToCart = () => {
    const cartItem: CartItem = {
      cartItemId: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      product: customizingProduct,
      restaurantId: customizingProduct.restaurantId,
      restaurantName: selectedRestaurant?.name || 'Restaurante',
      quantity,
      selectedOptions,
      specialInstructions: specialInstructions.trim() || undefined,
      unitPrice,
      totalPrice,
    };

    addToCart(cartItem);
    closeCustomizeProduct();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-xl max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900 shrink-0">
          <img
            src={customizingProduct.image}
            alt={customizingProduct.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />
          
          <button
            onClick={closeCustomizeProduct}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFD318]">
              {customizingProduct.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-sm">
              {customizingProduct.name}
            </h3>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {customizingProduct.description}
          </p>

          {/* Option Groups */}
          {customizingProduct.optionGroups && customizingProduct.optionGroups.map((group) => (
            <div key={group.id} className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-sm font-extrabold text-slate-900">
                  {group.name}
                </h4>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  group.required ? 'bg-blue-50 text-[#05268F]' : 'bg-slate-100 text-slate-600'
                }`}>
                  {group.required ? 'Obligatorio' : 'Opcional'}
                </span>
              </div>

              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected = selectedOptions.some((o) => o.optionId === option.id);

                  return (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => {
                        if (group.required) {
                          handleSelectRadioOption(group.id, group.name, option.id, option.name, option.priceDelta);
                        } else {
                          handleToggleCheckboxOption(group.id, group.name, option.id, option.name, option.priceDelta);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#05268F] bg-blue-50/50 shadow-xs'
                          : 'border-slate-200/80 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#05268F] border-[#05268F] text-white'
                            : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                          {option.name}
                        </span>
                      </div>

                      {option.priceDelta > 0 && (
                        <span className="text-xs font-black text-[#05268F]">
                          +{formatCurrency(option.priceDelta)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Instructions */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#05268F]" />
              <span>Instrucciones o notas especiales</span>
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Ejemplo: Sin cebolla, salsas aparte, carne bien jugosa..."
              rows={2}
              maxLength={200}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05268F] focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shadow-lg shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 disabled:opacity-40 flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-black text-sm text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold shadow-xs active:scale-95 cursor-pointer"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleConfirmAddToCart}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#05268F] hover:bg-[#031B66] text-white font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span>Agregar al pedido</span>
            <span className="bg-[#FFD318] text-[#05268F] px-2.5 py-0.5 rounded-xl text-xs font-black">
              {formatCurrency(totalPrice)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
