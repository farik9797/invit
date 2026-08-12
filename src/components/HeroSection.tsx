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
    <section className="bg-slate-100 py-6 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT MEGA-MENU CATALOG SIDEBAR (SmartTech index-3 archetype) */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col justify-between">
            {/* Header Title */}
            <div className="bg-[#0B5FA5] text-white px-4 py-3.5 flex items-center justify-between font-bold text-sm uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#F39200]" />
                Категории товаров
              </span>
              <span className="text-[11px] bg-blue-800 text-blue-100 px-2 py-0.5 rounded font-mono">
                B2B Опт
              </span>
            </div>

            {/* Category Groups list */}
            <div className="p-3 space-y-4 text-xs overflow-y-auto max-h-[480px]">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="space-y-1.5">
                  <div
                    onClick={() => onSelectCategory(cat.slug)}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-900 font-bold text-xs cursor-pointer transition-colors border border-slate-200/60 group"
                  >
                    <div className="flex items-center gap-2">
                      {cat.division === 'windows' ? (
                        <Layers className="w-4 h-4 text-[#0B5FA5] group-hover:scale-110 transition-transform" />
                      ) : (
                        <Wind className="w-4 h-4 text-[#0B5FA5] group-hover:scale-110 transition-transform" />
                      )}
                      <span className="group-hover:text-[#0B5FA5] transition-colors">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  {/* Subcategories list */}
                  <div className="pl-2 pr-1 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => onSelectCategory(cat.slug)}
                        className="flex items-center justify-between py-1 px-2.5 rounded hover:bg-slate-100 text-slate-700 hover:text-[#0B5FA5] cursor-pointer transition-colors"
                      >
                        <span className="truncate">{sub.name}</span>
                        {sub.count && (
                          <span className="text-[10px] text-slate-400 font-mono">
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
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={onOpenCallback}
                className="w-full bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white font-bold text-xs py-2 px-3 rounded shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Box className="w-3.5 h-3.5 text-[#F39200]" />
                Запросить полный прайс-лист (.XLSX)
              </button>
            </div>
          </div>

          {/* RIGHT HERO SLIDER (SmartTech index-3 archetype) */}
          <div className="lg:col-span-8 xl:col-span-9 relative bg-slate-900 rounded-xl shadow-xl overflow-hidden min-h-[420px] lg:min-h-[480px] flex flex-col justify-between group">
            {/* Background Image & Overlay Gradient */}
            <div className="absolute inset-0 z-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-35 transform scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
            </div>

            {/* Slider Content */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full">
              {/* Badge Tag */}
              <div className="flex items-center gap-2">
                <span className="bg-[#F39200] text-slate-950 font-black text-[11px] uppercase tracking-widest px-3 py-1 rounded shadow-sm">
                  Бренд EUROBAND
                </span>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 backdrop-blur px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F39200]" /> Гарантия качества РБ
                </span>
              </div>

              {/* Title & Description */}
              <div className="my-auto py-4 space-y-4 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="p-3.5 bg-blue-950/60 border-l-4 border-[#F39200] rounded-r-lg text-xs sm:text-sm font-semibold text-blue-100">
                  ⚡ {slide.highlight}
                </div>

                {/* Features bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {slide.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#F39200] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectCategory(slide.categoryLink)}
                  className="bg-[#0B5FA5] hover:bg-[#1A6DB5] active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2 uppercase tracking-wide cursor-pointer"
                >
                  <span>Смотреть каталог</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenCallback}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-lg border border-white/20 backdrop-blur transition-all cursor-pointer"
                >
                  Запросить оптовый расчет
                </button>
              </div>
            </div>

            {/* Slider Navigation Controls */}
            <div className="relative z-10 p-4 bg-slate-950/60 backdrop-blur border-t border-slate-800/80 flex items-center justify-between">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-8 bg-[#F39200]' : 'w-2.5 bg-slate-600 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
                  }
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
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
