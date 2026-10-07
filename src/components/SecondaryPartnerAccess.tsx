import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Bike, ChevronRight, ShieldCheck, DollarSign, Clock } from 'lucide-react';

export const SecondaryPartnerAccess: React.FC = () => {
  const { setPartnerModalType } = useApp();

  return (
    <div className="w-full px-4 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Partner Card 1: Registrar mi restaurante */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#05268F] font-extrabold text-[11px] mb-2 border border-blue-100">
                <Store className="w-3.5 h-3.5 text-[#05268F]" />
                Para Restaurantes & Cocinas
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-[#05268F] transition-colors">
                ¿Tienes un restaurante o cocina oculta?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Únete a la red Directaurante. Mantén tus márgenes con <strong>0% comisiones abusivas</strong>, recibe pagos directos y digitaliza tu menú en minutos.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#05268F] text-[#FFD318] flex items-center justify-center shrink-0 shadow-md group-hover:rotate-6 transition-transform">
              <Store className="w-7 h-7" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Sin contratos forzosos
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#05268F]" /> Más ganancia por plato
              </span>
            </div>

            <button
              onClick={() => setPartnerModalType('restaurant')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#05268F] hover:bg-[#031B66] text-white font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Registrar mi restaurante</span>
              <ChevronRight className="w-4 h-4 text-[#FFD318]" />
            </button>
          </div>
        </div>

        {/* Partner Card 2: Ser repartidor */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-extrabold text-[11px] mb-2 border border-amber-200/60">
                <Bike className="w-3.5 h-3.5 text-amber-600" />
                Para Repartidores Independientes
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-[#05268F] transition-colors">
                ¿Quieres generar ingresos en tu tiempo libre?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Conduce tu moto, bicicleta o carro entregando pedidos locales. Tú decides tus horarios y recibes tus ganancias semanales sin retenciones.
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#FFD318] text-[#05268F] flex items-center justify-center shrink-0 shadow-md group-hover:-rotate-6 transition-transform">
              <Bike className="w-7 h-7" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#05268F]" /> Horarios flexibles
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Pago 100% de propinas
              </span>
            </div>

            <button
              onClick={() => setPartnerModalType('courier')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD318] hover:bg-yellow-400 text-[#05268F] font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <span>Ser repartidor</span>
              <ChevronRight className="w-4 h-4 text-[#05268F]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
