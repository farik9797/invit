import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Wind, ChevronRight, ArrowRight } from 'lucide-react';
import { Breadcrumbs, PageHeading } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';

/** Витрина собственного производства — вместо простыни из всех позиций. */
const OWN_PRODUCTION = PRODUCTS.filter((p) => p.badge === 'Собственное производство').slice(0, 8);

export const CatalogPage: React.FC = () => {
  const shop = useShop();

  return (
    <>
      <Breadcrumbs items={[{ label: 'Каталог' }]} />
      <PageHeading
        eyebrow="B2B каталог"
        title="Каталог продукции EUROBAND"
        description="Материалы собственного производства для монтажа окон и герметизации, а также комплектующие для изготовления и монтажа воздуховодов."
      />

      {/* Разделы каталога */}
      <section className="max-w-[1340px] mx-auto px-5 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            const Icon = cat.division === 'windows' ? Layers : Wind;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-line shadow-xs overflow-hidden flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-ink/20" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-brand-red-light" />
                      <span className="text-[11px] font-bold  text-ink/40">
                        {count} позиций
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold leading-snug">{cat.name}</h2>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <p className="text-xs text-ink/70 leading-relaxed">{cat.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`${paths.category(cat.slug)}?sub=${sub.slug}`}
                        className="flex items-center justify-between py-1.5 text-xs text-ink/80 hover:text-brand-blue transition-colors border-b border-line"
                      >
                        <span className="truncate">{sub.name}</span>
                        <span className="text-[10px] text-ink/45 font-mono ml-2">{sub.count}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={paths.category(cat.slug)}
                    className="mt-1 inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors"
                  >
                    <span>Перейти в раздел</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Все позиции */}
      <section className="py-12 bg-white border-t border-line">
        <div className="max-w-[1340px] mx-auto px-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <div className="text-xs font-bold  text-brand-red mb-1.5">
                Собственное производство
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                Продукция под маркой EUROBAND
              </h2>
            </div>
            <Link
              to={paths.contacts}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              <span>Запросить полный прайс-лист</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid
            products={OWN_PRODUCTION}
            quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
            onQuickView={shop.openQuickView}
            onAddToQuote={shop.addToQuote}
          />
        </div>
      </section>
    </>
  );
};
