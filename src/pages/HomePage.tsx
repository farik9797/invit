import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { AdvantagesBar } from '../components/AdvantagesBar';
import { FeaturedCategories } from '../components/FeaturedCategories';
import { CustomCutBanner } from '../components/CustomCutBanner';
import { ProductGrid } from '../components/ProductCard';
import { PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';

/** Хиты для главной: собственное производство в приоритете, максимум 4 позиции. */
const HITS = [...PRODUCTS]
  .sort((a, b) => {
    const weight = (p: typeof a) =>
      p.badge === 'Собственное производство' ? 0 : p.badge === 'Хит' ? 1 : 2;
    return weight(a) - weight(b);
  })
  .slice(0, 4);

export const HomePage: React.FC = () => {
  const shop = useShop();
  const navigate = useNavigate();

  return (
    <>
      <HeroSection
        onSelectCategory={(slug) => navigate(paths.category(slug))}
        onOpenCallback={() => shop.openCallback('Запрос оптового прайс-листа с главной')}
      />

      <AdvantagesBar />

      <FeaturedCategories
        onSelectCategory={(slug, sub) =>
          navigate(sub ? `${paths.category(slug)}?sub=${sub}` : paths.category(slug))
        }
      />

      <CustomCutBanner onOpenCallbackWithNote={shop.openCallback} />

      {/* Хиты продаж — короткая выборка, полный каталог отдельной страницей */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-[1340px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-1.5">
                Хиты продаж
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Что заказывают чаще всего
              </h2>
            </div>

            <Link
              to={paths.catalog}
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              <span>Весь каталог</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid
            products={HITS}
            quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
            onQuickView={shop.openQuickView}
            onAddToQuote={shop.addToQuote}
          />
        </div>
      </section>

      {/* Короткий CTA вместо полной формы — форма живёт на странице контактов */}
      <section className="py-12 bg-gradient-to-r from-slate-950 via-brand-blue to-slate-950 text-white">
        <div className="max-w-[1340px] mx-auto px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Рассчитаем оптовую цену под ваш объект
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Пришлите спецификацию или просто список позиций — инженер отдела продаж подготовит
              коммерческое предложение с учётом объёма и сроков.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to={paths.contacts}
              className="bg-brand-red hover:bg-brand-red-hover text-white font-extrabold text-xs uppercase tracking-wide px-6 py-3.5 rounded-xl shadow-lg transition-colors"
            >
              Запросить КП
            </Link>
            <a
              href="tel:+375296444979"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur font-bold text-xs uppercase tracking-wide px-5 py-3.5 rounded-xl transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4" />
              +375 (29) 644-49-79
            </a>
            <a
              href="mailto:info@invit.by"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@invit.by
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
