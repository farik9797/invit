import React from 'react';
import { ChevronRight, ArrowUpRight, Layers, Wind } from 'lucide-react';
import { CATEGORIES } from '../data/catalogData';

interface FeaturedCategoriesProps {
  onSelectCategory: (slug: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onSelectCategory }) => {
  // Tile cards representing primary industrial focus categories
  const featuredCards = [
    {
      title: 'Монтажные ленты EUROBAND',
      subtitle: 'Пароизоляционные, гидроизоляционные & бутиловые',
      categorySlug: 'montazhnye-lenty',
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800',
      badge: 'Собственное производство',
      subitems: [
        'Внутренняя пароизоляция (дублированные)',
        'Наружная гидро-паропроницаемая',
        'Полнобутиловая защитная лента',
        'Ленты под штукатурку и откосы'
      ]
    },
    {
      title: 'ПСУЛ уплотнители',
      subtitle: 'Предварительно сжатые уплотнительные ленты',
      categorySlug: 'montazhnye-lenty',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
      badge: 'Хит продаж СТБ',
      subitems: [
        'ПСУЛ 10/2, 15/4, 20/8, 30/10',
        'Защита от ливневого дождя',
        'Паропроницаемое уплотнение',
        'Саморасширяющаяся формула'
      ]
    },
    {
      title: 'Герметики и пены EUROBAND',
      subtitle: 'Монтажная пена PRO 70L, очистители, клеи',
      categorySlug: 'montazhnye-lenty',
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=800',
      badge: 'Всесезонная формула',
      subitems: [
        'Профессиональная пена под пистолет',
        'Очистители незастывшей пены',
        'Бутиловые и акриловые герметики',
        'Клей-пена для утеплителя'
      ]
    },
    {
      title: 'Фланцевый профиль (Шинорейка)',
      subtitle: 'Профиль №20 и №30 для фланцев воздуховодов',
      categorySlug: 'komplektuyushchie-ventilyacii',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      badge: 'Заводской прокат',
      subitems: [
        'Шинорейка №20 (длина 3м)',
        'Шинорейка №30 (для крупных сечений)',
        'Оцинкованная сталь высокой цинковки',
        'Класс герметичности В и С'
      ]
    },
    {
      title: 'Монтажные уголки УГ',
      subtitle: 'Уголки фланцевые УГ-18, УГ-20, УГ-30',
      categorySlug: 'komplektuyushchie-ventilyacii',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
      badge: 'Штампованная сталь',
      subitems: [
        'Уголки УГ-20 (толщина 2.0 - 2.5 мм)',
        'Уголки УГ-30 для нагруженных узлов',
        'Жесткое скрепление по углам',
        'Перфорация под болты М8 / М10'
      ]
    },
    {
      title: 'Крепёж, траверсы и ленты ПЭС',
      subtitle: 'Комплектующие для систем вентиляции',
      categorySlug: 'komplektuyushchie-ventilyacii',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
      badge: 'В наличии в Минске',
      subitems: [
        'Монтажная C-траверса 20x30, 30x30',
        'Межфланцевая лента ПЭС (самоклейка)',
        'Перфолента и струбцины',
        'Антикоррозийный цинковый спрей'
      ]
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5FA5] mb-1">
              <Layers className="w-4 h-4 text-[#F39200]" />
              <span>Главные направления производства</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Категории продукции EUROBAND
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            ООО «ИНВИТ» поставляет полный спектр материалов для оконного монтажа, герметизации фасадов и сборки вентиляционных систем.
          </p>
        </div>

        {/* Tile Grid 2x3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Image Banner */}
              <div className="relative h-44 overflow-hidden bg-slate-800">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent"></div>
                <span className="absolute top-3 left-3 bg-[#F39200] text-slate-950 text-[10px] uppercase font-black px-2.5 py-1 rounded shadow">
                  {card.badge}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-extrabold text-white leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Subitems List */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {card.subitems.map((sub, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-2 hover:text-[#0B5FA5] transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B5FA5] shrink-0"></span>
                      <span className="truncate">{sub}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onSelectCategory(card.categorySlug)}
                  className="w-full mt-2 pt-3 border-t border-slate-100 text-xs font-bold text-[#0B5FA5] group-hover:text-[#1A6DB5] flex items-center justify-between cursor-pointer"
                >
                  <span>Перейти в раздел</span>
                  <div className="p-1.5 rounded-full bg-blue-50 group-hover:bg-[#0B5FA5] group-hover:text-white transition-all">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
