import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, CheckCheck, Clock, Sparkles } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { 
    isNotifCenterOpen, 
    setIsNotifCenterOpen, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setActiveTab
  } = useApp();

  if (!isNotifCenterOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="w-full sm:max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#05268F] flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Notificaciones
              </h3>
              <p className="text-xs text-slate-500">Alertas de tus pedidos y beneficios</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsAsRead}
              className="p-2 text-slate-500 hover:text-[#05268F] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Leídas</span>
            </button>
            <button
              onClick={() => setIsNotifCenterOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Cerrar notificaciones"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.orderId) {
                    setIsNotifCenterOpen(false);
                    setActiveTab('orders');
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  !notif.read
                    ? 'border-[#05268F]/30 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200/80 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {notif.type === 'order' ? (
                      <span className="w-2 h-2 rounded-full bg-[#05268F]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#FFD318]" />
                    )}
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
