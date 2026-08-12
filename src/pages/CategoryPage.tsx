import React from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Breadcrumbs, PageHeading } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths } from '../routes';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shop = useShop();

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return <Navigate to={paths.catalog} replace />;

  const activeSub = searchParams.get('sub');
  const categoryProducts = PRODUCTS.filter((p) => p.categorySlug === category.slug);
  const products = activeSub
    ? categoryProducts.filter((p) => p.subcategoryName === activeSub)
    : categoryProducts;

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
          {/* Подкатегории */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:sticky lg:top-28">
              <div className="bg-brand-blue text-white px-4 py-3 text-xs font-extrabold uppercase tracking-wider">
                Подразделы
              </div>
              <div className="p-2">
                <button
                  onClick={() => selectSub(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !activeSub ? 'bg-blue-50 text-brand-blue' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Все позиции ({categoryProducts.length})
                </button>

                {category.subcategories.map((sub) => {
                  const subCount = categoryProducts.filter(
                    (p) => p.subcategoryName === sub.name
                  ).length;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => selectSub(sub.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeSub === sub.name
                          ? 'bg-blue-50 text-brand-blue font-bold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate text-left">{sub.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">
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
              <span className="text-xs text-slate-500">
                Показано позиций: <strong className="text-slate-900">{products.length}</strong>
                {activeSub && <span className="ml-1">в подразделе «{activeSub}»</span>}
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
              products={products}
              quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
              onQuickView={shop.openQuickView}
              onAddToQuote={shop.addToQuote}
            />
          </div>
        </div>
      </section>
    </>
  );
};
