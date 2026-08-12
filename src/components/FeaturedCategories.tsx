import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Layers, Wind, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';

interface FeaturedCategoriesProps {
  onSelectCategory: (categorySlug: string, subSlug?: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'windows' | 'hvac'>('all');

  // Карточки строим из реального каталога: 6 самых наполненных разделов.
  const categoryCards = CATEGORIES.flatMap((cat) =>
    cat.subcategories.map((sub) => {
      const items = PRODUCTS.filter((p) => p.subcategorySlug === sub.slug);
      const leafNames = [...new Set(items.map((p) => p.shortTitle))].slice(0, 4);
      const own = items.some((p) => p.badge === 'Собственное производство');

      return {
        id: sub.slug,
        title: sub.name,
        subtitle: cat.name,
        categorySlug: cat.slug,
        subSlug: sub.slug,
        division: cat.division,
        count: `${sub.count} позиций`,
        image: items[0]?.image ?? cat.image,
        badge: own ? 'Собственное производство' : 'Прямые поставки',
        badgeColor: own
          ? 'bg-brand-red/10 text-brand-red border-brand-red/25'
          : 'bg-blue-100 text-brand-blue border-blue-200',
        subitems: leafNames.map((name) => ({ name, count: '' }))
      };
    })
  )
    .sort((a, b) => parseInt(b.count) - parseInt(a.count))
    .slice(0, 6);

  const filteredCards = categoryCards.filter((card) => {
    if (activeTab === 'windows') return card.division === 'windows';
    if (activeTab === 'hvac') return card.division === 'hvac';
    return true;
  });

  return (
    <section className="py-12 sm:py-16 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* SECTION HEADER WITH TABS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-blue bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-red" />
              <span>Главные направления производства</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Категории продукции EUROBAND
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Официальный белорусский производитель материалов для монтажа оконных блоков, герметизации фасадов и сборки вентиляционных систем.
            </p>
          </div>

          {/* TAB FILTERS */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Все направления ({categoryCards.length})
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'windows'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-brand-red" />
              <span>Оконный монтаж</span>
            </button>
            <button
              onClick={() => setActiveTab('hvac')}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hvac'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-brand-red" />
              <span>Вентиляция & Фасад</span>
            </button>
          </div>
        </div>

        {/* CATEGORY GRID: Modern E-Commerce Cards (as in reference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
            >
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Top Info & Image Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {card.count}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectCategory(card.categorySlug, card.subSlug)}
                      className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-brand-blue cursor-pointer transition-colors leading-snug tracking-tight"
                    >
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal line-clamp-1">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Thumbnail Image Box */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/80 shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Subcategories List with bullets */}
                <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Подкатегории:</span>
                    <span className="text-[10px] text-brand-blue font-semibold">СТБ / ГОСТ</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {card.subitems.map((sub, sIdx) => (
                      <li
                        key={sIdx}
                        onClick={() => onSelectCategory(card.categorySlug, card.subSlug)}
                        className="flex items-center justify-between hover:text-brand-blue cursor-pointer transition-colors font-medium group/sub"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 group-hover/sub:scale-125 transition-transform"></div>
                          <span className="truncate">{sub.name}</span>
                        </div>
                        {sub.count && (
                          <span className="text-[10px] text-slate-400 font-mono font-normal shrink-0">
                            {sub.count}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => onSelectCategory(card.categorySlug, card.subSlug)}
                  className="w-full pt-2 flex items-center justify-between text-xs font-extrabold text-brand-blue group-hover:text-brand-blue-hover cursor-pointer transition-colors"
                >
                  <span className="uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-red" />
                    Перейти в каталог раздела
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-brand-blue group-hover:text-white transition-all shadow-2xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>

              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM CALLOUT BANNER FOR ALL CATEGORIES */}
        <div className="mt-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-brand-blue rounded-xl border border-blue-100 shrink-0">
              <Layers className="w-6 h-6 text-brand-blue" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">Нужен индивидуальный типоразмер или оптовый спецификация?</div>
              <div className="text-xs text-slate-500">Нарежем ленты EUROBAND любой ширины от 10 мм до 1500 мм под чертежи объекта.</div>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('contacts');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-hover text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer shrink-0 shadow-xs"
          >
            <span>Запросить спецификацию</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </section>
  );
};

