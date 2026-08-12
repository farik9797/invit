import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Layers, Wind, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/catalogData';

interface FeaturedCategoriesProps {
  onSelectCategory: (slug: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'windows' | 'hvac'>('all');

  // Detailed categories formatted as featured cards with subitems and images
  const categoryCards = [
    {
      id: 'montazhnye-lenty-main',
      title: 'Монтажные ленты EUROBAND',
      subtitle: 'Пароизоляционные, гидроизоляционные & бутиловые',
      categorySlug: 'montazhnye-lenty',
      division: 'windows',
      count: '18 товаров',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600',
      badge: 'Собственное производство',
      badgeColor: 'bg-blue-100 text-[#0B5FA5] border-blue-200',
      subitems: [
        { name: 'Внутренние пароизоляционные ленты', count: '8 видов' },
        { name: 'Наружные диффузионные (мембранные)', count: '6 видов' },
        { name: 'Полнобутиловые гидроизоляционные', count: '4 вида' },
        { name: 'Ленты под штукатурку и мокрый фасад', count: '5 видов' }
      ]
    },
    {
      id: 'psul-main',
      title: 'ПСУЛ уплотнители',
      subtitle: 'Предварительно сжатые саморасширяющиеся ленты',
      categorySlug: 'montazhnye-lenty',
      division: 'windows',
      count: '12 товаров',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
      badge: 'Хит СТБ 1488',
      badgeColor: 'bg-[#F39200]/15 text-amber-900 border-[#F39200]/30',
      subitems: [
        { name: 'ПСУЛ 10/2-8, 15/4-20, 20/8-40', count: '10 размеров' },
        { name: 'Защита от ливневого дождя (600 Па)', count: 'Сертификат' },
        { name: 'Паропроницаемое уплотнение', count: 'СТБ ГОСТ' },
        { name: 'Ленты с акриловой пропиткой', count: 'Гарантия' }
      ]
    },
    {
      id: 'pena-germetik-main',
      title: 'Монтажная пена & Клеи',
      subtitle: 'Профессиональная пена PRO 70L, очистители, герметики',
      categorySlug: 'montazhnye-lenty',
      division: 'windows',
      count: '15 товаров',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=600',
      badge: 'Всесезонная формула',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      subitems: [
        { name: 'Пена пистолетная EUROBAND PRO 70L', count: '1000 мл' },
        { name: 'Очиститель монтажной пены', count: '500 мл' },
        { name: 'Бутиловые & Акриловые герметики', count: 'Картриджи' },
        { name: 'Клей-пена для пенополистирола', count: 'Выход 14 м²' }
      ]
    },
    {
      id: 'shinoreyka-main',
      title: 'Фланцевый профиль (Шинорейка)',
      subtitle: 'Шинорейка №20 и №30 для прямоугольных воздуховодов',
      categorySlug: 'komplektuyushchie-ventilyacii',
      division: 'hvac',
      count: '8 видов',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
      badge: 'Заводской прокат',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      subitems: [
        { name: 'Шинорейка №20 (длина 3.0 м)', count: 'Толщ. 0.6-0.7' },
        { name: 'Шинорейка №30 (длина 3.0 м)', count: 'Толщ. 0.8-0.9' },
        { name: 'Сталь оцинкованная ГОСТ 14918', count: 'Высокий цинк' },
        { name: 'Класс герметичности B и C', count: 'СТБ ЕН 1507' }
      ]
    },
    {
      id: 'ugolki-main',
      title: 'Монтажные уголки УГ',
      subtitle: 'Уголки фланцевые УГ-18, УГ-20, УГ-30',
      categorySlug: 'komplektuyushchie-ventilyacii',
      division: 'hvac',
      count: '12 видов',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600',
      badge: 'Штампованная сталь',
      badgeColor: 'bg-blue-100 text-[#0B5FA5] border-blue-200',
      subitems: [
        { name: 'Уголки УГ-20 (толщина 2.0 мм / 2.5 мм)', count: 'М8 отверстие' },
        { name: 'Уголки УГ-30 для больших сечений', count: 'М10 отверстие' },
        { name: 'Жесткое угловое скрепление', count: 'Антикоррозия' },
        { name: 'Упаковки по 250 / 500 шт', count: 'Со склада' }
      ]
    },
    {
      id: 'traversy-pes-main',
      title: 'Траверсы, ПЭС & Крепёж',
      subtitle: 'Комплектующие для монтажа систем вентиляции',
      categorySlug: 'komplektuyushchie-ventilyacii',
      division: 'hvac',
      count: '32 товара',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600',
      badge: 'В наличии на складе',
      badgeColor: 'bg-[#F39200]/15 text-amber-900 border-[#F39200]/30',
      subitems: [
        { name: 'Монтажная C-траверса 20x30 / 30x30', count: 'Длина 3 м' },
        { name: 'Межфланцевая лента ПЭС (Пеноэтилен)', count: '10х4, 15x4' },
        { name: 'Перфолента оцинкованная & Шпильки', count: 'М6 / М8 / М10' },
        { name: 'Антикоррозийный цинковый спрей', count: '400 мл' }
      ]
    }
  ];

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
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#0B5FA5] bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F39200]" />
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
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Все направления ({categoryCards.length})
            </button>
            <button
              onClick={() => setActiveTab('windows')}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'windows'
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#F39200]" />
              <span>Оконный монтаж</span>
            </button>
            <button
              onClick={() => setActiveTab('hvac')}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'hvac'
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-[#F39200]" />
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
                      onClick={() => onSelectCategory(card.categorySlug)}
                      className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-[#0B5FA5] cursor-pointer transition-colors leading-snug tracking-tight"
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
                    <span className="text-[10px] text-[#0B5FA5] font-semibold">СТБ / ГОСТ</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {card.subitems.map((sub, sIdx) => (
                      <li
                        key={sIdx}
                        onClick={() => onSelectCategory(card.categorySlug)}
                        className="flex items-center justify-between hover:text-[#0B5FA5] cursor-pointer transition-colors font-medium group/sub"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0B5FA5] shrink-0 group-hover/sub:scale-125 transition-transform"></div>
                          <span className="truncate">{sub.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono font-normal shrink-0">
                          {sub.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Action Button */}
                <button
                  onClick={() => onSelectCategory(card.categorySlug)}
                  className="w-full pt-2 flex items-center justify-between text-xs font-extrabold text-[#0B5FA5] group-hover:text-[#1A6DB5] cursor-pointer transition-colors"
                >
                  <span className="uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#F39200]" />
                    Перейти в каталог раздела
                  </span>
                  <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-[#0B5FA5] group-hover:text-white transition-all shadow-2xs">
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
            <div className="p-3 bg-blue-50 text-[#0B5FA5] rounded-xl border border-blue-100 shrink-0">
              <Layers className="w-6 h-6 text-[#F39200]" />
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
            className="w-full sm:w-auto bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer shrink-0 shadow-xs"
          >
            <span>Запросить спецификацию</span>
            <ArrowRight className="w-4 h-4 text-[#F39200]" />
          </button>
        </div>

      </div>
    </section>
  );
};

