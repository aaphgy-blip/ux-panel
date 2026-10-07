import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Store, 
  Bike, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { webAlerts } from '../utils/webAlerts';

export const PartnerRegistrationModal: React.FC = () => {
  const { partnerModalType, setPartnerModalType } = useApp();

  // Restaurant form state
  const [restName, setRestName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [restCity, setRestCity] = useState('');
  const [restPhone, setRestPhone] = useState('');
  const [restCategory, setRestCategory] = useState('Hamburguesas & Comida Rápida');

  // Courier form state
  const [courierName, setCourierName] = useState('');
  const [courierVehicle, setCourierVehicle] = useState('Motocicleta');
  const [courierCity, setCourierCity] = useState('');
  const [courierPhone, setCourierPhone] = useState('');

  const [submitted, setSubmitted] = useState(false);

  if (!partnerModalType) return null;

  const isRestaurant = partnerModalType === 'restaurant';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    webAlerts.success(
      isRestaurant ? '¡Solicitud de restaurante recibida!' : '¡Postulación de repartidor recibida!',
      'Un asesor de la Landing Page de Directaurante se comunicará contigo vía WhatsApp en menos de 2 horas.'
    );
  };

  const handleClose = () => {
    setPartnerModalType(null);
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-xl max-h-[92vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
              isRestaurant ? 'bg-[#05268F] text-[#FFD318]' : 'bg-[#FFD318] text-[#05268F]'
            }`}>
              {isRestaurant ? <Store className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Landing Page Directaurante
              </span>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {isRestaurant ? 'Registrar mi Restaurante' : 'Ser Repartidor Directaurante'}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {!submitted ? (
            <>
              {/* Value proposition highlight card */}
              <div className={`p-4 rounded-2xl border ${
                isRestaurant 
                  ? 'bg-blue-50/70 border-blue-200 text-[#05268F]' 
                  : 'bg-amber-50/70 border-amber-200 text-amber-950'
              }`}>
                <h4 className="font-black text-sm mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {isRestaurant 
                    ? '¿Por qué vender con Directaurante?' 
                    : '¿Por qué repartir con Directaurante?'}
                </h4>
                <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                  {isRestaurant ? (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>0% comisiones abusivas:</strong> mantén tus utilidades íntegras.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Control de tus clientes:</strong> fideliza con tu propia marca.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Menú digital y pedidos en WhatsApp:</strong> activación en 24 horas.</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>100% de tus propinas:</strong> Directaurante no retiene tus propinas.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Pagos semanales sin demora:</strong> transferencias directas a tu cuenta.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Horarios libres:</strong> tú decides qué días y a qué horas conectarte.</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Quick pre-registration form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Completa tus datos para activación express
                </h4>

                {isRestaurant ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre del restaurante / marca *
                      </label>
                      <input
                        type="text"
                        value={restName}
                        onChange={(e) => setRestName(e.target.value)}
                        placeholder="Ej: Hamburguesas La Estación"
                        required
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nombre del contacto / dueño *
                        </label>
                        <input
                          type="text"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Ej: Laura Ramírez"
                          required
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ciudad y zona *
                        </label>
                        <input
                          type="text"
                          value={restCity}
                          onChange={(e) => setRestCity(e.target.value)}
                          placeholder="Ej: Bogotá - Chapinero"
                          required
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp de contacto *
                        </label>
                        <input
                          type="tel"
                          value={restPhone}
                          onChange={(e) => setRestPhone(e.target.value)}
                          placeholder="+57 310 000 0000"
                          required
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tipo de comida
                        </label>
                        <select
                          value={restCategory}
                          onChange={(e) => setRestCategory(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        >
                          <option>Hamburguesas & Comida Rápida</option>
                          <option>Pizzas & Pastas</option>
                          <option>Sushi & Comida Asiática</option>
                          <option>Tacos & Mexicana</option>
                          <option>Saludable & Bowls</option>
                          <option>Postres & Cafetería</option>
                          <option>Otro</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="Ej: Carlos Eduardo Méndez"
                        required
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Medio de transporte *
                        </label>
                        <select
                          value={courierVehicle}
                          onChange={(e) => setCourierVehicle(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        >
                          <option>Motocicleta</option>
                          <option>Bicicleta / E-Bike</option>
                          <option>Automóvil</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ciudad donde repartirás *
                        </label>
                        <input
                          type="text"
                          value={courierCity}
                          onChange={(e) => setCourierCity(e.target.value)}
                          placeholder="Ej: Bogotá, Medellín, Cali..."
                          required
                          className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Número de WhatsApp celular *
                      </label>
                      <input
                        type="tel"
                        value={courierPhone}
                        onChange={(e) => setCourierPhone(e.target.value)}
                        placeholder="+57 312 000 0000"
                        required
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#05268F]"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer mt-4 ${
                    isRestaurant
                      ? 'bg-[#05268F] hover:bg-[#031B66] text-white'
                      : 'bg-[#FFD318] hover:bg-yellow-400 text-[#05268F]'
                  }`}
                >
                  <span>
                    {isRestaurant ? 'Enviar solicitud de activación' : 'Comenzar registro de repartidor'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-900">
                ¡Información enviada con éxito!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Gracias por tu interés en crecer con <strong>Directaurante</strong>. Nuestro equipo comercial se comunicará contigo vía WhatsApp para finalizar la activación.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-2xl bg-[#05268F] text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Volver a la App
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
