import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { Sparkles, X } from 'lucide-react';

export const CategoryCarousel: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Duplicated list to create a seamless infinite loop effect
  const infiniteList = [...CATEGORIES, ...CATEGORIES];

  const handleSelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="w-full py-3.5 bg-white border-b border-slate-100 overflow-hidden relative select-none">
      <div className="w-full px-4 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFD318]" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            ¿Qué se te antoja hoy?
          </h3>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1 text-xs font-bold text-[#05268F] hover:underline cursor-pointer"
          >
            <span>Ver todas las categorías</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full overflow-hidden group">
        <div 
          ref={scrollContainerRef}
          className="animate-infinite-scroll flex items-center gap-2.5 sm:gap-3 py-1 cursor-grab active:cursor-grabbing"
        >
          {infiniteList.map((cat, index) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={`${cat.id}-${index}`}
                onClick={() => handleSelect(cat.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#05268F] text-white border-[#05268F] shadow-md scale-105'
                    : 'bg-slate-50 hover:bg-yellow-50/70 border-slate-200/80 text-slate-800 hover:border-[#FFD318] hover:shadow-xs active:scale-95'
                }`}
              >
                <span className="text-xl sm:text-2xl" role="img" aria-label={cat.name}>
                  {cat.icon}
                </span>
                <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {cat.name}
                </span>

                {cat.badge && (
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#FFD318] text-[#05268F]'
                        : 'bg-[#FFD318]/20 text-[#05268F] border border-[#FFD318]/40'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
