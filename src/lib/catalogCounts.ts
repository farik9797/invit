import { PRODUCTS } from '../data/catalogData';
import { specValue } from './catalogFilters';

/*
 * Сколько позиций в разделе и подразделе.
 *
 * Считается один раз при загрузке модуля: фильтр по всем 5124 товарам на каждую
 * строку меню и каждую перерисовку был заметен на слабых машинах.
 */
export const COUNT_CATEGORY = new Map<string, number>();
export const COUNT_SUB = new Map<string, number>();

const bump = (counts: Map<string, number>, slug?: string) => {
  if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
};

for (const product of PRODUCTS) {
  bump(COUNT_CATEGORY, product.categorySlug);
  bump(COUNT_SUB, product.subcategorySlug);
  // Вторая прописка: товар считается в обоих разделах
  bump(COUNT_CATEGORY, product.alsoCategorySlug);
  bump(COUNT_SUB, product.alsoSubcategorySlug);
}

/*
 * Ленты собственного производства: своего раздела у них нет, они лежат в
 * четырёх разных. В меню каталога это отдельная строка, ведущая на отбор
 * по бренду — и в колонке на большом экране, и в шторке на телефоне.
 */
export const OWN_BRAND = 'EUROBAND';
export const OWN_COUNT = PRODUCTS.filter((p) => specValue(p, 'Бренд') === OWN_BRAND).length;
