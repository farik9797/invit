import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { CategoryTiles } from '../components/home/CategoryTiles';
import { AboutIntro } from '../components/home/AboutIntro';
import { SinceBlock } from '../components/home/SinceBlock';
import { NewsGrid } from '../components/home/NewsGrid';
import { ContactBanner } from '../components/home/ContactBanner';
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

      {/* Сразу после главного экрана — категории, следом товары */}
      <CategoryTiles />

      <section className="py-16 sm:py-24 bg-surface-soft">
        <div className="max-w-[1340px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-semibold text-brand-green">Продукция</span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                Ленты нашего производства
              </h2>
            </div>

            <Link
              to={paths.catalog}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
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

      <AboutIntro />
      <SinceBlock />
      <NewsGrid />
      <ContactBanner />
      <CertificatesStrip />
    </>
  );
};
