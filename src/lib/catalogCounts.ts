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

for (const product of PRODUCTS) {
  COUNT_CATEGORY.set(product.categorySlug, (COUNT_CATEGORY.get(product.categorySlug) ?? 0) + 1);
  COUNT_SUB.set(product.subcategorySlug, (COUNT_SUB.get(product.subcategorySlug) ?? 0) + 1);
}

/*
 * Ленты собственного производства: своего раздела у них нет, они лежат в
 * четырёх разных. В меню каталога это отдельная строка, ведущая на отбор
 * по бренду — и в колонке на большом экране, и в шторке на телефоне.
 */
export const OWN_BRAND = 'EUROBAND';
export const OWN_COUNT = PRODUCTS.filter((p) => specValue(p, 'Бренд') === OWN_BRAND).length;
