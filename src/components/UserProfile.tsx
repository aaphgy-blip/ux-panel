import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Volume2, 
  Store, 
  Bike, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  LogOut,
  Edit2
} from 'lucide-react';
import { webAlerts } from '../utils/webAlerts';

export const UserProfile: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    setIsAddressModalOpen, 
    setActiveTab,
    setPartnerModalType
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    setIsEditing(false);
  };

  const handleSupportWhatsApp = () => {
    webAlerts.info('Soporte Directaurante', 'Conectando con un asesor de soporte al cliente vía WhatsApp (+57 300 000 0000)');
  };

  return (
    <div className="w-full px-4 py-4 pb-28 space-y-5">
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
        Mi Perfil
      </h1>

      {/* User Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#05268F] shadow-sm shrink-0">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {userProfile.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {userProfile.email}
              </p>
              <p className="text-xs text-[#05268F] font-bold mt-0.5">
                {userProfile.phone}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-[#05268F] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Editar perfil"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono móvil</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#05268F] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Preferences & Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 shadow-xs">
        {/* Addresses */}
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#05268F] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Mis Direcciones Guardadas</h4>
              <p className="text-xs text-slate-500">Administra tus casas, oficinas y notas de entrega</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Orders */}
        <button
          onClick={() => setActiveTab('orders')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Historial & Estado de Pedidos</h4>
              <p className="text-xs text-slate-500">Rastreo de envíos activos y facturas</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Sound toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sonido de alertas y pedidos</h4>
              <p className="text-xs text-slate-500">Reproducir aviso sonoro cuando cambie el estatus</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userProfile.soundEnabled}
            onChange={(e) => updateUserProfile({ soundEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#05268F] cursor-pointer"
          />
        </div>

        {/* Notifications toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Notificaciones push & estado</h4>
              <p className="text-xs text-slate-500">Avisos de motorizado cerca y promociones</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={userProfile.notificationsEnabled}
            onChange={(e) => updateUserProfile({ notificationsEnabled: e.target.checked })}
            className="w-5 h-5 accent-[#05268F] cursor-pointer"
          />
        </div>
      </div>

      {/* Secondary Partner Links towards Landing Page */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Oportunidades Directaurante
        </h3>

        <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 overflow-hidden shadow-xs">
          <button
            onClick={() => setPartnerModalType('restaurant')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#05268F] text-[#FFD318] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#05268F]">
                  Registrar mi restaurante
                </h4>
                <p className="text-xs text-slate-500">Conoce el modelo de 0% comisión y vende directo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setPartnerModalType('courier')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFD318] text-[#05268F] flex items-center justify-center">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#05268F]">
                  Ser repartidor
                </h4>
                <p className="text-xs text-slate-500">Trabaja en tus horas libres con ingresos garantizados</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={handleSupportWhatsApp}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Centro de Ayuda & Soporte</h4>
                <p className="text-xs text-slate-500">Atención personalizada 24/7 vía WhatsApp</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
