import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { ProductList } from '../components/catalog/ProductList';
import { CatalogSidebar } from '../components/catalog/CatalogSidebar';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import {
  CatalogFilters,
  SORT_LABEL,
  SortMode,
  isFiltered,
  readFilters,
  selectProducts,
  toggle,
  writeFilters
} from '../lib/catalogFilters';
import { plural } from '../lib/plural';
import { paths } from '../routes';

/*
 * Каталог по образцу обычного интернет-магазина: слева разделы и отбор,
 * сверху поиск и переключатель вида, справа выдача плиткой или списком.
 *
 * Весь отбор хранится в адресе страницы, поэтому ссылку с выбранным брендом
 * можно переслать, а «назад» возвращает предыдущий набор. Исключение — вид
 * выдачи: это привычка человека, а не свойство ссылки, и живёт он в localStorage.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';
const VIEW_KEY = 'invit:catalog-view';

type ViewMode = 'grid' | 'list';

const readView = (): ViewMode => {
  try {
    return localStorage.getItem(VIEW_KEY) === 'list' ? 'list' : 'grid';
  } catch {
    return 'grid';
  }
};

const SUB_NAME = new Map<string, string>();
for (const cat of CATEGORIES) for (const sub of cat.subcategories) SUB_NAME.set(sub.slug, sub.name);

/** Выбранное значение отдельной плашкой: видно, что сузило выдачу, и снимается одним нажатием. */
const Chip: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full border border-inv-border bg-inv-surface-1 text-[13px] text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-red hover:text-inv-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
  >
    {label}
    <X className="w-3.5 h-3.5" />
  </button>
);

export const CatalogPage: React.FC = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const shop = useShop();

  const category = categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) ?? null : null;
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const [draft, setDraft] = useState(filters.query);
  useEffect(() => setDraft(filters.query), [filters.query]);

  const [view, setView] = useState<ViewMode>(readView);
  const [drawer, setDrawer] = useState(false);

  const result = useMemo(
    () => selectProducts(PRODUCTS, category?.slug ?? null, filters),
    [category, filters]
  );

  const pageSize = view === 'list' ? 40 : 24;
  const [visible, setVisible] = useState(pageSize);
  const key = searchParams.toString();
  useEffect(() => setVisible(pageSize), [categorySlug, key, pageSize]);

  // Выдвижная панель закрывается по Esc и не даёт странице прокручиваться под собой
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false);
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [drawer]);

  if (categorySlug && !category) return <Navigate to={paths.catalog} replace />;

  const update = (patch: Partial<CatalogFilters>) =>
    setSearchParams(writeFilters({ ...filters, ...patch }));

  const switchView = (next: ViewMode) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* приватный режим — вид просто не запомнится */
    }
  };

  const products = result.products;
  const shown = Math.min(visible, products.length);

  const crumbs = category
    ? [{ label: 'Каталог', to: paths.catalog }, { label: category.name }]
    : [{ label: 'Каталог' }];

  const sidebar = (variant: 'aside' | 'drawer', onNavigate?: () => void) => (
    <CatalogSidebar
      variant={variant}
      category={category}
      filters={filters}
      result={result}
      onSub={(slug) => update({ sub: slug })}
      onBrand={(value) => update({ brands: toggle(filters.brands, value) })}
      onCountry={(value) => update({ countries: toggle(filters.countries, value) })}
      onReset={() => setSearchParams(new URLSearchParams())}
      onNavigate={onNavigate}
    />
  );

  const active = filters.brands.length + filters.countries.length + (filters.sub ? 1 : 0);

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
        <div className={`${WRAP} py-6 sm:py-8 lg:py-12`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Прилипающая колонка без своей прокрутки: её обрезка съедала бы
                панель мега-меню, которая выходит за края колонки. */}
            <aside className="hidden lg:block lg:col-span-3">
              {/*
               * z-10: position:sticky заводит свой контекст наложения, и без
               * z-index панель мега-меню уходила под карточки товаров — у них
               * своё наложение от анимации появления. Но выше десятки нельзя:
               * у шапки сайта z-30, и колонка наезжала на неё при прокрутке.
               *
               * Отступ 148px — это высота шапки (76 + 1 + 56 + рамка) плюс
               * небольшой зазор: при top-24 колонка подлезала под шапку и
               * верхние сорок точек пропадали.
               */}
              <div className="lg:sticky lg:top-[148px] z-10">{sidebar('aside')}</div>
            </aside>

            <div className="lg:col-span-9">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update({ query: draft });
                }}
                className="flex gap-2"
              >
                <span className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inv-ink-muted" />
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Поиск по каталогу: лента, ПСУЛ, артикул…"
                    aria-label="Поиск по каталогу"
                    className="w-full min-h-11 pl-9 pr-9 rounded-[4px] border border-inv-border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                  {draft && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft('');
                        update({ query: '' });
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

              {/* Панель управления выдачей */}
              <div className="mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  className="lg:hidden inline-flex items-center gap-2 min-h-11 px-3.5 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue hover:text-inv-blue"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Разделы и фильтр
                  {active > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
                      {active}
                    </span>
                  )}
                </button>

                <span className="text-sm text-inv-ink-muted">
                  {products.length
                    ? `Показано ${shown} из ${products.length} ${plural(products.length, ['позиции', 'позиций', 'позиций'])}`
                    : 'Ничего не нашлось'}
                </span>

                <span className="flex items-center gap-2 ml-auto">
                  <label className="sr-only" htmlFor="catalog-sort">
                    Порядок
                  </label>
                  <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(e) => update({ sort: e.target.value as SortMode })}
                    className="min-h-11 pl-3 pr-8 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  >
                    {(Object.keys(SORT_LABEL) as SortMode[]).map((mode) => (
                      <option key={mode} value={mode}>
                        {SORT_LABEL[mode]}
                      </option>
                    ))}
                  </select>

                  <span
                    role="group"
                    aria-label="Вид выдачи"
                    className="flex items-center rounded-[4px] border border-inv-border overflow-hidden"
                  >
                    {([
                      ['grid', LayoutGrid, 'Плиткой'],
                      ['list', List, 'Списком']
                    ] as [ViewMode, typeof List, string][]).map(([mode, Icon, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => switchView(mode)}
                        aria-pressed={view === mode}
                        title={label}
                        className={`inline-flex items-center gap-1.5 min-h-11 px-3 text-sm font-semibold cursor-pointer transition-colors duration-[120ms] ${
                          view === mode
                            ? 'bg-inv-blue text-white'
                            : 'bg-white text-inv-ink-muted hover:text-inv-blue'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{label}</span>
                      </button>
                    ))}
                  </span>
                </span>
              </div>

              {/* Что сейчас выбрано */}
              {isFiltered(filters) && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {filters.sub && (
                    <Chip
                      label={SUB_NAME.get(filters.sub) ?? filters.sub}
                      onRemove={() => update({ sub: null })}
                    />
                  )}
                  {filters.query && (
                    <Chip label={`«${filters.query}»`} onRemove={() => update({ query: '' })} />
                  )}
                  {filters.brands.map((brand) => (
                    <Chip
                      key={brand}
                      label={brand}
                      onRemove={() => update({ brands: toggle(filters.brands, brand) })}
                    />
                  ))}
                  {filters.countries.map((country) => (
                    <Chip
                      key={country}
                      label={country}
                      onRemove={() => update({ countries: toggle(filters.countries, country) })}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setSearchParams(new URLSearchParams())}
                    className="inline-flex items-center gap-1.5 h-8 px-2 text-[13px] font-semibold text-inv-red hover:text-inv-red-hover cursor-pointer transition-colors duration-[120ms]"
                  >
                    Сбросить всё
                  </button>
                </div>
              )}

              {products.length ? (
                <>
                  <div className="mt-5">
                    {view === 'list' ? (
                      <ProductList
                        products={products.slice(0, visible)}
                        quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
                        onAddToQuote={shop.addToQuote}
                      />
                    ) : (
                      <ProductGrid
                        columns={3}
                        products={products.slice(0, visible)}
                        quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
                        onQuickView={shop.openQuickView}
                        onAddToQuote={shop.addToQuote}
                      />
                    )}
                  </div>

                  {visible < products.length && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisible((v) => v + pageSize)}
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
                    {filters.query
                      ? `По запросу «${filters.query}» ничего не нашлось.`
                      : 'Под выбранный фильтр ничего не подошло.'}
                  </p>
                  <p className="mt-2 text-sm text-inv-ink-muted">
                    Снимите часть условий или позвоните — подскажем по наличию.
                  </p>
                  {isFiltered(filters) && (
                    <button
                      type="button"
                      onClick={() => setSearchParams(new URLSearchParams())}
                      className="mt-4 inline-flex items-center gap-1.5 min-h-11 px-5 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] hover:bg-inv-blue-hover"
                    >
                      Сбросить фильтр
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Разделы и фильтр на телефоне */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${drawer ? '' : 'pointer-events-none'}`}
        aria-hidden={!drawer}
      >
        <div
          onClick={() => setDrawer(false)}
          className={`absolute inset-0 bg-inv-deep/50 transition-opacity duration-[240ms] motion-reduce:transition-none ${
            drawer ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Разделы и фильтр"
          className={`absolute inset-y-0 left-0 w-[min(92vw,380px)] bg-white shadow-[0_0_40px_rgba(22,44,88,0.25)] overflow-y-auto transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            drawer ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <header className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-white border-b border-inv-border">
            <span className="flex-1 text-sm font-semibold text-inv-ink">Разделы и фильтр</span>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              aria-label="Закрыть"
              className="w-11 h-11 -mr-2 flex items-center justify-center text-inv-ink-muted hover:text-inv-ink cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          <div className="p-3">{sidebar('drawer', () => setDrawer(false))}</div>

          <div className="sticky bottom-0 p-3 bg-white border-t border-inv-border">
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="w-full min-h-11 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] hover:bg-inv-blue-hover"
            >
              Показать {products.length} {plural(products.length, ['позицию', 'позиции', 'позиций'])}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
