import { Product } from '../types';
import { sortForListing } from './product';
import { searchProducts } from './search';

/*
 * Отбор товаров в каталоге: раздел, подраздел, поиск, бренд, страна, признаки
 * и порядок. Всё состояние живёт в адресе страницы — ссылку с отбором можно
 * переслать коллеге, и назад/вперёд в браузере работают сами собой.
 *
 * Счётчики у значений считаются «без себя»: выбранный бренд не сужает список
 * брендов, иначе после первого же щелчка остальные исчезли бы и переключиться
 * было бы не на что.
 */

export type SortMode = 'default' | 'name' | 'name-desc';
export type Flag = 'own' | 'photo' | 'variants';

export const FLAG_LABEL: Record<Flag, string> = {
  own: 'Собственное производство',
  photo: 'Со снимком',
  variants: 'С исполнениями'
};

export const SORT_LABEL: Record<SortMode, string> = {
  default: 'Сначала наши и со снимком',
  name: 'Название: А → Я',
  'name-desc': 'Название: Я → А'
};

export interface CatalogFilters {
  sub: string | null;
  query: string;
  brands: string[];
  countries: string[];
  flags: Flag[];
  sort: SortMode;
}

export const EMPTY_FILTERS: CatalogFilters = {
  sub: null,
  query: '',
  brands: [],
  countries: [],
  flags: [],
  sort: 'default'
};

const isFlag = (value: string): value is Flag => value in FLAG_LABEL;
const isSort = (value: string): value is SortMode => value in SORT_LABEL;

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
    flags: many(params, 'only').filter(isFlag),
    sort: isSort(sort) ? sort : 'default'
  };
};

export const writeFilters = (filters: CatalogFilters): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters.sub) params.set('sub', filters.sub);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.brands.length) params.set('brand', filters.brands.join(','));
  if (filters.countries.length) params.set('country', filters.countries.join(','));
  if (filters.flags.length) params.set('only', filters.flags.join(','));
  if (filters.sort !== 'default') params.set('sort', filters.sort);
  return params;
};

/** Отбор тронут — значит есть что сбрасывать (раздел в адресе, а не здесь). */
export const isFiltered = (f: CatalogFilters) =>
  Boolean(f.sub || f.query || f.brands.length || f.countries.length || f.flags.length);

export const specValue = (product: Product, label: string) =>
  product.specs.find((s) => s.label === label)?.value ?? '';

export const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

const hasFlag = (product: Product, flag: Flag) => {
  if (flag === 'own') return product.badge === 'Собственное производство';
  if (flag === 'photo') return Boolean(product.image);
  return Boolean(product.variants?.length);
};

const applySort = (products: Product[], sort: SortMode) => {
  if (sort === 'default') return sortForListing(products);
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

export interface CatalogResult {
  products: Product[];
  brands: [string, number][];
  countries: [string, number][];
  flags: Record<Flag, number>;
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
  const byFlags = (p: Product) => filters.flags.every((flag) => hasFlag(p, flag));

  const products = base.filter((p) => byBrand(p) && byCountry(p) && byFlags(p));
  const forFlags = base.filter((p) => byBrand(p) && byCountry(p));

  return {
    products: applySort(products, filters.sort),
    brands: countBy(base.filter((p) => byCountry(p) && byFlags(p)), 'Бренд'),
    countries: countBy(base.filter((p) => byBrand(p) && byFlags(p)), 'Страна'),
    flags: {
      own: forFlags.filter((p) => hasFlag(p, 'own')).length,
      photo: forFlags.filter((p) => hasFlag(p, 'photo')).length,
      variants: forFlags.filter((p) => hasFlag(p, 'variants')).length
    },
    scope: base.length
  };
};
