import { Product } from '../types';
import { sortForListing } from './product';
import { searchProducts } from './search';
import { SECTION_SIZES, SizeAxis, bySize, productSize } from './productSize';
import { PRICES_SHOWN } from './price';

/*
 * Отбор товаров в каталоге: раздел, подраздел, поиск, бренд, страна, признаки
 * и порядок. Всё состояние живёт в адресе страницы — ссылку с отбором можно
 * переслать коллеге, и назад/вперёд в браузере работают сами собой.
 *
 * Счётчики у значений считаются «без себя»: выбранный бренд не сужает список
 * брендов, иначе после первого же щелчка остальные исчезли бы и переключиться
 * было бы не на что.
 */

export type SortMode = 'default' | 'price' | 'price-desc' | 'name' | 'name-desc';

export const SORT_LABEL: Record<SortMode, string> = {
  default: 'Сортировать по',
  price: 'Цена: сначала дешёвые',
  'price-desc': 'Цена: сначала дорогие',
  name: 'Название: А → Я',
  'name-desc': 'Название: Я → А'
};

/** Что показывать в списке сортировки: с выключенными ценами — только название. */
export const SORT_OPTIONS: SortMode[] = PRICES_SHOWN
  ? ['default', 'price', 'price-desc', 'name', 'name-desc']
  : ['default', 'name', 'name-desc'];

export interface CatalogFilters {
  sub: string | null;
  query: string;
  brands: string[];
  countries: string[];
  /** Размеры: у каждого раздела свои оси, см. SECTION_SIZES. */
  sizes: Record<SizeAxis, string[]>;
  /** Цена «от» и «до»; null — граница не задана. */
  price: { min: number | null; max: number | null };
  sort: SortMode;
}

export const EMPTY_FILTERS: CatalogFilters = {
  sub: null,
  query: '',
  brands: [],
  countries: [],
  sizes: { diameter: [], length: [] },
  price: { min: null, max: null },
  sort: 'default'
};

const isSort = (value: string): value is SortMode => value in SORT_LABEL;

/** Граница цены из адреса: мусор вроде «abc» считаем незаданной границей. */
const money = (raw: string | null): number | null => {
  const value = Number((raw ?? '').replace(',', '.'));
  return raw && Number.isFinite(value) && value >= 0 ? value : null;
};

const many = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

export const readFilters = (params: URLSearchParams): CatalogFilters => {
  const sort = params.get('sort') ?? '';
  return {
    sub: params.get('sub'),
    query: params.get('q') ?? '',
    brands: many(params, 'brand'),
    countries: many(params, 'country'),
    sizes: { diameter: many(params, 'd'), length: many(params, 'l') },
    // С выключенными ценами прежние ссылки с ?pmin= ничего не отбирают
    price: PRICES_SHOWN
      ? { min: money(params.get('pmin')), max: money(params.get('pmax')) }
      : { min: null, max: null },
    sort: isSort(sort) ? sort : 'default'
  };
};

export const writeFilters = (filters: CatalogFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.sub) params.set('sub', filters.sub);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.brands.length) params.set('brand', filters.brands.join(','));
  if (filters.countries.length) params.set('country', filters.countries.join(','));
  if (filters.sizes.diameter.length) params.set('d', filters.sizes.diameter.join(','));
  if (filters.sizes.length.length) params.set('l', filters.sizes.length.join(','));
  if (filters.price.min !== null) params.set('pmin', String(filters.price.min));
  if (filters.price.max !== null) params.set('pmax', String(filters.price.max));
  if (filters.sort !== 'default') params.set('sort', filters.sort);
  return params;
};

/** Отбор тронут — значит есть что сбрасывать (раздел в адресе, а не здесь). */
export const isFiltered = (f: CatalogFilters) =>
  Boolean(
    f.sub ||
      f.query ||
      f.brands.length ||
      f.countries.length ||
      f.sizes.diameter.length ||
      f.sizes.length.length ||
      f.price.min !== null ||
      f.price.max !== null
  );

export const specValue = (product: Product, label: string) =>
  product.specs.find((s) => s.label === label)?.value ?? '';

export const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const applySort = (products: Product[], sort: SortMode) => {
  if (sort === 'default') return sortForListing(products);

  if (sort === 'price' || sort === 'price-desc') {
    const dir = sort === 'price' ? 1 : -1;
    // Позиции без цены («по запросу») всегда в конце, в обе стороны: наверху
    // списка они выглядели бы как самые дешёвые или самые дорогие.
    return [...products].sort((a, b) => {
      if (a.price === undefined) return b.price === undefined ? 0 : 1;
      if (b.price === undefined) return -1;
      return dir * (a.price - b.price);
    });
  }

  const dir = sort === 'name' ? 1 : -1;
  return [...products].sort((a, b) => dir * a.title.localeCompare(b.title, 'ru', { numeric: true }));
};

/** Значения признака со счётчиками, по убыванию частоты. */
export const countBy = (products: Product[], label: string): [string, number][] => {
  const counts = new Map<string, number>();
  for (const product of products) {
    const value = specValue(product, label);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru')
  );
};

/** Значения размера со счётчиками, по возрастанию. */
const countSizes = (products: Product[], axis: SizeAxis): [string, number][] => {
  const counts = new Map<string, number>();
  for (const product of products) {
    const value = productSize(product)[axis];
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort(bySize);
};

export interface CatalogResult {
  products: Product[];
  brands: [string, number][];
  countries: [string, number][];
  /** Оси размера этого раздела со значениями; в «Всех позициях» пусто. */
  sizes: { axis: SizeAxis; options: [string, number][] }[];
  /** Самая дешёвая и самая дорогая позиция выборки — подсказка для полей «от» и «до». */
  priceRange: { min: number; max: number } | null;
  /** Сколько позиций в разделе до отбора по бренду, стране и признакам. */
  scope: number;
}

export const selectProducts = (
  all: Product[],
  categorySlug: string | null,
  filters: CatalogFilters
): CatalogResult => {
  let base = all;
  if (categorySlug) base = base.filter((p) => p.categorySlug === categorySlug);
  if (filters.sub) base = base.filter((p) => p.subcategorySlug === filters.sub);
  base = searchProducts(base, filters.query);

  const byBrand = (p: Product) =>
    !filters.brands.length || filters.brands.includes(specValue(p, 'Бренд'));
  const byCountry = (p: Product) =>
    !filters.countries.length || filters.countries.includes(specValue(p, 'Страна'));

  // Размеры показываем только внутри раздела: в общем каталоге 125 мм круга
  // встали бы в один список с 3.5 мм самореза.
  const axes = (categorySlug && SECTION_SIZES[categorySlug]) ?? [];
  const bySize_ = (axis: SizeAxis) => (p: Product) => {
    const chosen = filters.sizes[axis];
    return !chosen.length || chosen.includes(productSize(p)[axis]);
  };
  const byAllSizes = (p: Product) => axes.every((axis) => bySize_(axis)(p));

  const byPrice = (p: Product) => {
    const { min, max } = filters.price;
    if (min === null && max === null) return true;
    if (p.price === undefined) return false;   // «по запросу» в диапазон не попадает
    return (min === null || p.price >= min) && (max === null || p.price <= max);
  };

  const products = base.filter(
    (p) => byBrand(p) && byCountry(p) && byAllSizes(p) && byPrice(p)
  );

  const priced = base
    .filter((p) => byBrand(p) && byCountry(p) && byAllSizes(p) && p.price !== undefined)
    .map((p) => p.price as number);

  return {
    products: applySort(products, filters.sort),
    brands: countBy(base.filter((p) => byCountry(p) && byAllSizes(p) && byPrice(p)), 'Бренд'),
    countries: countBy(base.filter((p) => byBrand(p) && byAllSizes(p) && byPrice(p)), 'Страна'),
    sizes: axes.map((axis) => ({
      axis,
      options: countSizes(
        base.filter(
          (p) =>
            byBrand(p) &&
            byCountry(p) &&
            byPrice(p) &&
            axes.every((other) => other === axis || bySize_(other)(p))
        ),
        axis
      )
    })),
    priceRange: PRICES_SHOWN && priced.length
      ? { min: Math.min(...priced), max: Math.max(...priced) }
      : null,
    scope: base.length
  };
};
