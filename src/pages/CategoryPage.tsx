import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Breadcrumbs, PageHeading } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';
import { sortForListing } from '../lib/product';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shop = useShop();

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return <Navigate to={paths.catalog} replace />;

  const activeSub = searchParams.get('sub');
  const activeSubName = category.subcategories.find((s) => s.slug === activeSub)?.name;
  const categoryProducts = sortForListing(PRODUCTS.filter((p) => p.categorySlug === category.slug));
  const products = activeSub
    ? categoryProducts.filter((p) => p.subcategorySlug === activeSub)
    : categoryProducts;

  const PAGE_SIZE = 24;
  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => setVisible(PAGE_SIZE), [categorySlug, activeSub]);

  const selectSub = (name: string | null) => {
    if (name) setSearchParams({ sub: name });
    else setSearchParams({});
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Каталог', to: paths.catalog },
          { label: category.name }
        ]}
      />
      <PageHeading
        eyebrow={category.division === 'windows' ? 'Материалы для монтажа окон' : 'Вентиляция'}
        title={category.name}
        description={category.description}
      />

      <section className="max-w-[1340px] mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Подразделы: на телефоне — прокручиваемая лента чипов, на десктопе — боковой список */}
          <div className="lg:hidden -mx-5 px-5 overflow-x-auto">
            <div className="flex gap-2 w-max pb-1">
              <button
                onClick={() => selectSub(null)}
                className={`px-3.5 py-2 rounded-lg text-xs whitespace-nowrap border transition-colors cursor-pointer ${
                  !activeSub
                    ? 'bg-brand-blue text-white border-brand-blue font-semibold'
                    : 'bg-white text-ink/80 border-line'
                }`}
              >
                Все ({categoryProducts.length})
              </button>
              {category.subcategories.map((sub) => {
                const subCount = categoryProducts.filter(
                  (p) => p.subcategorySlug === sub.slug
                ).length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => selectSub(sub.slug)}
                    className={`px-3.5 py-2 rounded-lg text-xs whitespace-nowrap border transition-colors cursor-pointer ${
                      activeSub === sub.slug
                        ? 'bg-brand-blue text-white border-brand-blue font-semibold'
                        : 'bg-white text-ink/80 border-line'
                    }`}
                  >
                    {sub.name} <span className="opacity-60">{subCount}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-xl border border-line shadow-xs overflow-hidden lg:sticky lg:top-28">
              <div className="bg-brand-blue text-white px-4 py-3 text-xs font-semibold ">
                Подразделы
              </div>
              <div className="p-2">
                <button
                  onClick={() => selectSub(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !activeSub ? 'bg-brand-sky-soft text-brand-blue' : 'text-ink/80 hover:bg-surface-soft'
                  }`}
                >
                  Все позиции ({categoryProducts.length})
                </button>

                {category.subcategories.map((sub) => {
                  const subCount = categoryProducts.filter(
                    (p) => p.subcategorySlug === sub.slug
                  ).length;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => selectSub(sub.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeSub === sub.slug
                          ? 'bg-brand-sky-soft text-brand-blue font-bold'
                          : 'text-ink/70 hover:bg-surface-soft'
                      }`}
                    >
                      <span className="truncate text-left">{sub.name}</span>
                      <span className="text-[10px] text-ink/45 font-mono ml-2">
                        {subCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Товары */}
          <div className="lg:col-span-9 space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-xs text-ink/55">
                Показано позиций: <strong className="text-ink">{products.length}</strong>
                {activeSubName && <span className="ml-1">в подразделе «{activeSubName}»</span>}
              </span>
              {activeSub && (
                <button
                  onClick={() => selectSub(null)}
                  className="text-xs font-bold text-brand-red hover:text-brand-red-hover transition-colors cursor-pointer"
                >
                  Сбросить фильтр ✕
                </button>
              )}
            </div>

            <ProductGrid
              columns={3}
              products={products.slice(0, visible)}
              quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
              onQuickView={shop.openQuickView}
              onAddToQuote={shop.addToQuote}
            />
            {visible < products.length && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="px-6 py-3 rounded-xl border border-line bg-white text-ink font-bold text-sm hover:bg-surface-soft transition-colors cursor-pointer"
                >
                  Показать ещё ({products.length - visible})
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
