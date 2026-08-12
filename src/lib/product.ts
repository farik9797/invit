import { Product } from '../types';

/**
 * Варианты исполнения для сметы. Берём первый столбец размерного ряда с сайта
 * (там обычно ширина или наименование типоразмера), иначе — обобщённые варианты.
 */
export const variantOptions = (product: Product): string[] => {
  // Единицу измерения берём из шапки таблицы: «Ширина ленты, мм» -> «70 мм».
  const header = product.sizes?.headers[0] ?? '';
  const unit = header.match(/,\s*([а-яa-z.]+)\s*$/i)?.[1] ?? '';
  const withUnit = (value: string) =>
    unit && /^[\d.,\s/xх-]+$/.test(value) ? `${value} ${unit}` : value;

  const fromSizes = product.sizes?.rows.map((row) => withUnit(row[0])).filter(Boolean) ?? [];
  const unique = [...new Set(fromSizes)].slice(0, 12);
  return unique.length ? [...unique, 'Нестандартный размер (под заказ)'] : ['Стандартное исполнение', 'Нестандартный размер (под заказ)'];
};

export const defaultVariant = (product: Product) => variantOptions(product)[0];
