import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserAddress } from '../types';
import { 
  X, 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  Home, 
  Briefcase, 
  Heart, 
  Edit3 
} from 'lucide-react';
import { webAlerts } from '../utils/webAlerts';

export const AddressesManager: React.FC = () => {
  const { 
    isAddressModalOpen, 
    setIsAddressModalOpen, 
    addresses, 
    selectedAddress, 
    setSelectedAddress, 
    addAddress, 
    deleteAddress 
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [details, setDetails] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tag, setTag] = useState<'home' | 'work' | 'favorite' | 'other'>('home');

  if (!isAddressModalOpen) return null;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fullAddress.trim()) {
      webAlerts.warning('Campos incompletos', 'Ingresa al menos el nombre y la dirección.');
      return;
    }

    addAddress({
      title: title.trim(),
      fullAddress: fullAddress.trim(),
      details: details.trim() || undefined,
      deliveryInstructions: deliveryInstructions.trim() || undefined,
      isDefault: false,
      tag,
    });

    setIsAddingNew(false);
    setTitle('');
    setFullAddress('');
    setDetails('');
    setDeliveryInstructions('');
  };

  const getTagIcon = (t: string) => {
    switch (t) {
      case 'home': return <Home className="w-4 h-4 text-[#05268F]" />;
      case 'work': return <Briefcase className="w-4 h-4 text-amber-600" />;
      case 'favorite': return <Heart className="w-4 h-4 text-rose-500" />;
      default: return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#05268F] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Mis Direcciones de Entrega
              </h3>
              <p className="text-xs text-slate-500">Selecciona o agrega una dirección</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAddressModalOpen(false);
              setIsAddingNew(false);
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {!isAddingNew ? (
            <>
              {addresses.map((addr) => {
                const isSelected = selectedAddress.id === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      webAlerts.success('Dirección seleccionada', `${addr.title} • ${addr.fullAddress}`);
                      setIsAddressModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-[#05268F] bg-blue-50/50 shadow-xs'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getTagIcon(addr.tag)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900">
                            {addr.title}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#05268F] text-white">
                              Activa
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-0.5 leading-snug">
                          {addr.fullAddress}
                        </p>
                        {addr.details && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {addr.details}
                          </p>
                        )}
                        {addr.deliveryInstructions && (
                          <p className="text-[11px] text-[#05268F] italic mt-1">
                            "{addr.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(addr.id);
                          }}
                          className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Eliminar dirección"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#05268F] text-[#05268F] font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-blue-50/50 transition-all cursor-pointer mt-2"
              >
                <Plus className="w-4 h-4 text-[#05268F]" />
                <span>Agregar nueva dirección de entrega</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveNewAddress} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nombre de la dirección *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Casa, Oficina, Gimnasio, Pareja"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Dirección exacta *
                </label>
                <input
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Ej: Calle 93 # 14-20"
                  required
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Apartamento, piso o torre (opcional)
                </label>
                <input
                  type="text"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Ej: Apto 302, Torre 3, Portería principal"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Instrucciones para el repartidor (opcional)
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Ej: Timbrar al 302 o dejar con el vigilante"
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tipo de lugar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'home', label: 'Casa', icon: <Home className="w-3.5 h-3.5" /> },
                    { id: 'work', label: 'Trabajo', icon: <Briefcase className="w-3.5 h-3.5" /> },
                    { id: 'favorite', label: 'Favorito', icon: <Heart className="w-3.5 h-3.5" /> },
                    { id: 'other', label: 'Otro', icon: <MapPin className="w-3.5 h-3.5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTag(item.id as any)}
                      className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        tag === item.id
                          ? 'border-[#05268F] bg-[#05268F] text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#05268F] text-white font-extrabold text-xs active:scale-95 cursor-pointer shadow-xs"
                >
                  Guardar Dirección
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
