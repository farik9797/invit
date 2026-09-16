import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import {
  X,
  SlidersHorizontal,
  ChevronDown,
  Grid3x3,
  Grid2x2,
  Rows3
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { ProductList } from '../components/catalog/ProductList';
import { CatalogSidebar } from '../components/catalog/CatalogSidebar';
import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { FilterBar } from '../components/catalog/FilterBar';
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
import { SIZE_LABEL, SizeAxis, sizeChip } from '../lib/productSize';
import { priceChip } from '../lib/price';
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

type ViewMode = 'dense' | 'grid' | 'list';

/** Три вида выдачи: плотная плитка, обычная плитка, список. */
const VIEWS = [
  { mode: 'dense' as const, Icon: Grid3x3, label: 'Плотной плиткой' },
  { mode: 'grid' as const, Icon: Grid2x2, label: 'Плиткой' },
  { mode: 'list' as const, Icon: Rows3, label: 'Списком' }
];

/** В плотной плитке карточки мельче, поэтому и порция больше. */
const PAGE_SIZE: Record<ViewMode, number> = { dense: 48, grid: 24, list: 40 };

const readView = (): ViewMode => {
  try {
    const saved = localStorage.getItem(VIEW_KEY);
    return VIEWS.some((v) => v.mode === saved) ? (saved as ViewMode) : 'grid';
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
  const navigate = useNavigate();
  const shop = useShop();

  const category = categorySlug ? CATEGORIES.find((c) => c.slug === categorySlug) ?? null : null;
  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const [view, setView] = useState<ViewMode>(readView);
  const [drawer, setDrawer] = useState(false);
  // Пришли по ссылке с отбором — строка фильтров сразу раскрыта, иначе
  // непонятно, почему в выдаче не всё.
  const [bar, setBar] = useState(() => isFiltered(readFilters(searchParams)));

  const result = useMemo(
    () => selectProducts(PRODUCTS, category?.slug ?? null, filters),
    [category, filters]
  );

  const pageSize = PAGE_SIZE[view];
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

  /*
   * Подсказка ищет по всему каталогу, поэтому и «показать все» уводит в целый
   * каталог: иначе число в подсказке не сошлось бы с выдачей — в открытом
   * разделе нашлось бы куда меньше. Пустой запрос просто снимается, раздел и
   * бренды при этом остаются.
   */
  const runSearch = (value: string) => {
    if (value) navigate(`${paths.catalog}?q=${encodeURIComponent(value)}`);
    else update({ query: '' });
  };

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
      search={
        variant === 'aside' ? (
          <CatalogSearch query={filters.query} onSubmit={runSearch} />
        ) : null
      }
      category={category}
      filters={filters}
      result={result}
      onSub={(slug) => update({ sub: slug })}
      onBrand={(value) => update({ brands: toggle(filters.brands, value) })}
      onCountry={(value) => update({ countries: toggle(filters.countries, value) })}
      onSize={(axis, value) =>
        update({ sizes: { ...filters.sizes, [axis]: toggle(filters.sizes[axis], value) } })
      }
      onPrice={(price) => update({ price })}
      onReset={() => setSearchParams(new URLSearchParams())}
      onNavigate={onNavigate}
    />
  );

  const active =
    filters.brands.length +
    filters.countries.length +
    filters.sizes.diameter.length +
    filters.sizes.length.length +
    (filters.price.min !== null || filters.price.max !== null ? 1 : 0) +
    (filters.sub ? 1 : 0);

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
               * Колонка не прилипает. Со списком разделов в ней 1093px, а на
               * экране 900 остаётся 750 — нижняя треть с фильтром просто не
               * доезжала бы: прилипший блок стоит на месте, а прокрутка идёт
               * мимо него.
               *
               * z-10 нужен, чтобы панель подразделов ложилась поверх карточек:
               * у них своё наложение от анимации появления. Выше десятки
               * нельзя — у шапки сайта z-30.
               */}
              <div className="relative z-10">{sidebar('aside')}</div>
            </aside>

            <div className="lg:col-span-9">
              {/* На телефоне колонки нет, поэтому поиск остаётся над выдачей */}
              <CatalogSearch
                query={filters.query}
                onSubmit={runSearch}
                withButton
                className="lg:hidden"
              />

              {/* Панель управления выдачей */}
              {/*
               * Одна строка: счётчик слева, сортировка и значки вида справа.
               * В 375 точек это не влезает, поэтому на телефоне порядок другой —
               * фильтр и значки сверху, под ними сортировка, затем счётчик.
               */}
              <div className="mt-4 flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  className="order-1 sm:order-2 lg:hidden inline-flex items-center gap-2 min-h-11 px-3.5 rounded-[10px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue hover:text-inv-blue"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Разделы и фильтр</span>
                  <span className="sm:hidden">Фильтр</span>
                  {active > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
                      {active}
                    </span>
                  )}
                </button>

                {/* Фильтры рядом с сортировкой: всё управление выдачей в одном
                    месте. На телефоне их место занимает выдвижная панель. */}
                <button
                  type="button"
                  onClick={() => setBar((v) => !v)}
                  aria-expanded={bar}
                  className={`hidden lg:inline-flex order-2 lg:ml-auto items-center gap-2 min-h-11 px-3.5 rounded-[10px] border bg-white text-sm font-semibold cursor-pointer transition-colors duration-[120ms] ${
                    bar || active > 0
                      ? 'border-inv-blue text-inv-ink'
                      : 'border-inv-border text-inv-ink hover:border-inv-blue'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Фильтры
                  {active > 0 && (
                    <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
                      {active}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-[240ms] ${bar ? 'rotate-180' : ''}`}
                  />
                </button>

                <span className="order-4 w-full text-sm text-inv-ink-muted sm:order-1 sm:w-auto">
                  {products.length
                    ? `Показано ${shown} из ${products.length} ${plural(products.length, ['позиции', 'позиций', 'позиций'])}`
                    : 'Ничего не нашлось'}
                </span>

                <span className="relative order-3 w-full sm:w-auto sm:ml-auto lg:ml-0">
                  <label className="sr-only" htmlFor="catalog-sort">
                    Сортировать по
                  </label>
                  <select
                    id="catalog-sort"
                    value={filters.sort}
                    onChange={(e) => update({ sort: e.target.value as SortMode })}
                    className="appearance-none w-full sm:w-auto min-h-11 pl-4 pr-10 rounded-[10px] border border-inv-border bg-white text-sm text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  >
                    {(Object.keys(SORT_LABEL) as SortMode[]).map((mode) => (
                      <option key={mode} value={mode}>
                        {SORT_LABEL[mode]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-inv-ink-muted"
                  />
                </span>

                {/* Вид выдачи: значки без подписей, выбранный красный */}
                <span
                  role="group"
                  aria-label="Вид выдачи"
                  className="order-2 ml-auto shrink-0 sm:order-4 sm:ml-0 flex items-center gap-1 p-1 rounded-[10px] border border-inv-border bg-white"
                >
                  {VIEWS.map(({ mode, Icon, label }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => switchView(mode)}
                      aria-pressed={view === mode}
                      aria-label={label}
                      title={label}
                      className={`w-9 h-9 flex items-center justify-center rounded-[7px] cursor-pointer transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
                        view === mode
                          ? 'bg-inv-red text-white'
                          : 'text-inv-ink-muted hover:text-inv-ink hover:bg-inv-surface-1'
                      }`}
                    >
                      <Icon className="w-[18px] h-[18px]" />
                    </button>
                  ))}
                </span>
              </div>

              {bar && (
                <div className="hidden lg:block">
                  <FilterBar
                    filters={filters}
                    result={result}
                    onChange={update}
                  />
                </div>
              )}

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
                  {(filters.price.min !== null || filters.price.max !== null) && (
                    <Chip
                      label={priceChip(filters.price)}
                      onRemove={() => update({ price: { min: null, max: null } })}
                    />
                  )}
                  {(Object.keys(SIZE_LABEL) as SizeAxis[]).flatMap((axis) =>
                    filters.sizes[axis].map((value) => (
                      <Chip
                        key={`${axis}-${value}`}
                        label={sizeChip(axis, value)}
                        onRemove={() =>
                          update({
                            sizes: { ...filters.sizes, [axis]: toggle(filters.sizes[axis], value) }
                          })
                        }
                      />
                    ))
                  )}
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
                  <div className="mt-4">
                    {view === 'list' ? (
                      <ProductList
                        products={products.slice(0, visible)}
                        quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
                        onAddToQuote={shop.addToQuote}
                      />
                    ) : (
                      <ProductGrid
                        columns={view === 'dense' ? 5 : 3}
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
