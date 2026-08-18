import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { Facts } from '../components/home/Facts';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { CertificatesStrip } from '../components/home/CertificatesStrip';
import { ProductGrid } from '../components/ProductCard';
import { PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { isTape } from '../lib/product';
import { paths } from '../routes';

/** На главной показываем только ленты собственного производства. */
const OWN_TAPES = PRODUCTS.filter(
  (p) => isTape(p) && p.badge === 'Собственное производство'
).slice(0, 8);

export const HomePage: React.FC = () => {
  const shop = useShop();

  return (
    <>
      <Hero onOpenCallback={() => shop.openCallback('Запрос расчёта с главной')} />
      <Facts />
      <CategoryTiles />

      {/* Товары — сразу после категорий */}
      <section className="py-16 sm:py-20 bg-surface-soft border-t border-line">
        <div className="max-w-[1340px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                Продукция
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
                Ленты нашего производства
              </h2>
            </div>

            <Link
              to={paths.catalog}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              Весь каталог
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid
            products={OWN_TAPES}
            quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
            onQuickView={shop.openQuickView}
            onAddToQuote={shop.addToQuote}
          />
        </div>
      </section>

      <CertificatesStrip />

      {/* Короткий призыв — без длинных описаний */}
      <section className="py-16 bg-surface">
        <div className="max-w-[1340px] mx-auto px-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy tracking-tight">
              Рассчитаем цену под ваш объём
            </h2>
            <p className="mt-2 text-sm text-brand-navy/60">
              Пришлите список позиций — подготовим коммерческое предложение.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={paths.contacts}
              className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors"
            >
              Запросить КП
            </Link>
            <a
              href="tel:+375296444979"
              className="inline-flex items-center gap-2 border border-line hover:border-brand-sky text-brand-navy text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-brand-red" />
              +375 (29) 644-49-79
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
