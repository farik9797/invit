import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Layers,
  Wind,
  Box,
  Sliders,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES, HERO_SLIDES } from '../data/catalogData';

interface HeroSectionProps {
  onSelectCategory: (slug: string) => void;
  onOpenCallback: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectCategory, onOpenCallback }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Auto rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="bg-slate-100/90 py-6 sm:py-8 border-b border-slate-200">
      <div className="max-w-[1340px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT MEGA-MENU CATALOG SIDEBAR */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
            {/* Header Title */}
            <div className="bg-brand-blue text-white px-4 py-3.5 flex items-center justify-between font-extrabold text-xs uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-white" />
                Категории товаров
              </span>
              <span className="text-[10px] bg-blue-800/80 text-blue-100 px-2 py-0.5 rounded font-mono font-bold">
                B2B Опт
              </span>
            </div>

            {/* Category Groups list */}
            <div className="p-3 space-y-3.5 text-xs overflow-y-auto max-h-[440px] scrollbar-thin scrollbar-thumb-slate-200">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="space-y-1">
                  <div
                    onClick={() => onSelectCategory(cat.slug)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/80 text-slate-900 font-extrabold text-xs cursor-pointer transition-all border border-slate-200/80 group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {cat.division === 'windows' ? (
                        <Layers className="w-4 h-4 text-brand-blue shrink-0 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Wind className="w-4 h-4 text-brand-blue shrink-0 group-hover:scale-110 transition-transform" />
                      )}
                      <span className="group-hover:text-brand-blue transition-colors truncate">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Subcategories list */}
                  <div className="pl-2 pr-1 space-y-0.5">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onSelectCategory(cat.slug)}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-brand-blue cursor-pointer transition-colors text-[11px] font-medium"
                      >
                        <span className="truncate">{sub.name}</span>
                        {sub.count && (
                          <span className="text-[10px] text-slate-400 font-mono ml-1">
                            {sub.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Mega-Menu Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={onOpenCallback}
                className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-white" />
                <span>Запросить прайс-лист (.XLSX)</span>
              </button>
            </div>
          </div>

          {/* RIGHT HERO SLIDER */}
          <div className="lg:col-span-8 xl:col-span-9 relative bg-slate-950 rounded-2xl shadow-xl overflow-hidden min-h-[440px] lg:min-h-[480px] flex flex-col justify-between group border border-slate-800">
            {/* Background Image & Overlay Gradient */}
            <div className="absolute inset-0 z-0">
              {HERO_SLIDES.map((item, idx) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt=""
                  aria-hidden
                  className={`absolute inset-0 w-full h-full object-cover transform scale-105 transition-opacity duration-700 ${
                    idx === currentSlide ? 'opacity-40' : 'opacity-0'
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent"></div>
            </div>

            {/* Slider Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full">
              {/* Badge Tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-brand-red text-white font-black text-[10px] sm:text-[11px] uppercase tracking-widest px-3 py-1 rounded-md shadow-sm">
                  Сделано в Беларуси
                </span>
                <span className="text-xs font-semibold text-slate-200 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-md border border-slate-700/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-red-light" />
                  <span>Собственное производство ООО «ИНВИТ»</span>
                </span>
              </div>

              {/* Title & Description — все слайды лежат в одной ячейке грида,
                  поэтому высота блока равна самому длинному слайду и не прыгает при смене */}
              <div className="my-auto py-4 grid max-w-2xl">
                {HERO_SLIDES.map((item, idx) => (
                  <div
                    key={item.id}
                    aria-hidden={idx !== currentSlide}
                    className={`col-start-1 row-start-1 space-y-4 transition-opacity duration-500 ${
                      idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      {item.title}
                    </h1>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-300 font-normal leading-relaxed">
                      {item.subtitle}
                    </p>

                    <div className="p-3.5 bg-blue-950/70 border-l-4 border-brand-red rounded-r-xl text-xs sm:text-sm font-semibold text-blue-100 backdrop-blur-xs">
                      ⚡ {item.highlight}
                    </div>

                    {/* Features bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {item.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-200 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-brand-red-light shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectCategory(slide.categoryLink)}
                  className="bg-brand-blue hover:bg-brand-blue-hover active:scale-98 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  <span>Смотреть каталог</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={onOpenCallback}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl border border-white/20 backdrop-blur transition-all cursor-pointer"
                >
                  Запросить оптовый расчет
                </button>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="relative z-10 p-3.5 bg-slate-950/80 backdrop-blur border-t border-slate-800/80 flex items-center justify-between">
              {/* Dots */}
              <div className="flex items-center gap-2 pl-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-7 bg-brand-red' : 'w-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
