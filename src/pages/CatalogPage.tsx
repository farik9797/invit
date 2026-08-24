import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { sortForListing } from '../lib/product';
import { paths } from '../routes';

/*
 * Каталог по образцу обычного интернет-магазина (референс labzerde.com/shop):
 * слева дерево категорий, сверху поиск, справа сетка карточек.
 *
 * Одна страница обслуживает и `/catalog`, и `/catalog/:categorySlug` — раньше
 * это были два разных компонента с почти одинаковой разметкой, а верхний блок
 * с двумя большими карточками разделов клиент попросил убрать как лишний.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const PAGE_SIZE = 24;

const plural = (n: number, forms: [string, string, string]) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  const mod10 = n % 10;
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const countIn = (categorySlug: string) =>
  PRODUCTS.filter((p) => p.categorySlug === categorySlug).length;

const countInSub = (subSlug: string) =>
  PRODUCTS.filter((p) => p.subcategorySlug === subSlug).length;

export const CatalogPage: React.FC = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shop = useShop();

  const category = categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) : null;
  const activeSub = searchParams.get('sub');
  const query = searchParams.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  useEffect(() => setDraft(query), [query]);

  const products = useMemo(() => {
    let list = PRODUCTS;
    if (category) list = list.filter((p) => p.categorySlug === category.slug);
    if (activeSub) list = list.filter((p) => p.subcategorySlug === activeSub);

    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter((p) =>
        `${p.title} ${p.shortTitle} ${p.subcategoryName}`.toLowerCase().includes(needle)
      );
    }

    return sortForListing(list);
  }, [category, activeSub, query]);

  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => setVisible(PAGE_SIZE), [categorySlug, activeSub, query]);

  if (categorySlug && !category) return <Navigate to={paths.catalog} replace />;

  const applySearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set('q', value.trim());
    else next.delete('q');
    setSearchParams(next);
  };

  const selectSub = (slug: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('sub', slug);
    else next.delete('sub');
    setSearchParams(next);
  };

  const crumbs = category
    ? [{ label: 'Каталог', to: paths.catalog }, { label: category.name }]
    : [{ label: 'Каталог' }];

  return (
    <>
      <Breadcrumbs items={crumbs} />

      <section className="bg-inv-deep text-white">
        <div className={`${WRAP} py-8 sm:py-10 lg:py-12`}>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            {category ? category.name : 'Каталог'}
          </h1>
          <p className="mt-3 text-base leading-[1.55] text-inv-on-deep max-w-[70ch]">
            {category
              ? category.description
              : 'Ленты EUROBAND собственного производства и сопутствующие материалы прямой поставки.'}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${WRAP} py-8 sm:py-10 lg:py-12`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Категории слева */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 rounded-[8px] border border-inv-border overflow-hidden">
                <h2 className="bg-inv-surface-1 px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted border-b border-inv-border">
                  Категории
                </h2>

                <nav className="p-2">
                  <Link
                    to={paths.catalog}
                    className={`flex items-center justify-between gap-3 min-h-11 px-3 rounded-[4px] text-sm transition-colors duration-[120ms] ${
                      !category
                        ? 'bg-inv-surface-1 text-inv-red font-semibold'
                        : 'text-inv-ink hover:text-inv-blue'
                    }`}
                  >
                    Все позиции
                    <span className="text-xs text-inv-ink-muted tabular-nums">
                      {PRODUCTS.length}
                    </span>
                  </Link>

                  {CATEGORIES.map((cat) => {
                    const isOpen = category?.slug === cat.slug;

                    return (
                      <div key={cat.id} className="mt-1">
                        <Link
                          to={paths.category(cat.slug)}
                          className={`flex items-center justify-between gap-3 min-h-11 px-3 rounded-[4px] text-sm transition-colors duration-[120ms] ${
                            isOpen
                              ? 'bg-inv-surface-1 text-inv-red font-semibold'
                              : 'text-inv-ink hover:text-inv-blue'
                          }`}
                        >
                          <span className="flex-1">{cat.name}</span>
                          <span className="text-xs text-inv-ink-muted tabular-nums">
                            {countIn(cat.slug)}
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 transition-transform duration-[240ms] ${
                              isOpen ? 'rotate-90' : ''
                            }`}
                          />
                        </Link>

                        {/* Подразделы раскрываются только у выбранной категории */}
                        {isOpen && (
                          <ul className="mt-1 ml-3 border-l border-inv-border">
                            {cat.subcategories.map((sub) => (
                              <li key={sub.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    selectSub(activeSub === sub.slug ? null : sub.slug)
                                  }
                                  className={`w-full flex items-center justify-between gap-3 min-h-11 pl-4 pr-3 text-left text-sm cursor-pointer transition-colors duration-[120ms] ${
                                    activeSub === sub.slug
                                      ? 'text-inv-red font-semibold'
                                      : 'text-inv-ink-muted hover:text-inv-blue'
                                  }`}
                                >
                                  <span className="flex-1 leading-snug">{sub.name}</span>
                                  <span className="text-xs tabular-nums">
                                    {countInSub(sub.slug)}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Поиск и товары */}
            <div className="lg:col-span-9">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applySearch(draft);
                }}
                className="flex gap-2"
              >
                <span className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inv-ink-muted" />
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Поиск по каталогу: лента, ПСУЛ, профиль…"
                    aria-label="Поиск по каталогу"
                    className="w-full min-h-11 pl-9 pr-9 rounded-[4px] border border-inv-border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                  {draft && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft('');
                        applySearch('');
                      }}
                      aria-label="Очистить поиск"
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-inv-ink-muted hover:text-inv-ink cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </span>

                <button
                  type="submit"
                  className="min-h-11 px-6 rounded-[4px] bg-inv-blue text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] hover:bg-inv-blue-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  Найти
                </button>
              </form>

              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-sm text-inv-ink-muted">
                  {products.length
                    ? `Показано ${Math.min(visible, products.length)} из ${products.length} ${plural(products.length, ['позиции', 'позиций', 'позиций'])}`
                    : 'Ничего не нашлось'}
                </span>

                {(activeSub || query) && (
                  <button
                    type="button"
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-red hover:text-inv-red-hover cursor-pointer transition-colors duration-[120ms]"
                  >
                    <X className="w-4 h-4" />
                    Сбросить фильтр
                  </button>
                )}
              </div>

              {products.length ? (
                <>
                  <div className="mt-6">
                    <ProductGrid
                      columns={6}
                      products={products.slice(0, visible)}
                      quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
                      onQuickView={shop.openQuickView}
                      onAddToQuote={shop.addToQuote}
                    />
                  </div>

                  {visible < products.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisible((v) => v + PAGE_SIZE)}
                        className="min-h-11 px-6 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue hover:text-inv-blue"
                      >
                        Показать ещё ({products.length - visible})
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-6 rounded-[8px] border border-inv-border bg-inv-surface-1 p-8 text-center">
                  <p className="text-base text-inv-ink">
                    По запросу «{query}» ничего не нашлось.
                  </p>
                  <p className="mt-2 text-sm text-inv-ink-muted">
                    Попробуйте короче: «ПСУЛ», «ВЛ», «профиль». Или позвоните, подскажем
                    по наличию.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
