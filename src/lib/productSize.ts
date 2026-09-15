import { Product } from '../types';

/*
 * Размер из названия товара.
 *
 * Отдельного поля с размером поставщик не прислал — он зашит в название:
 * «Анкер-шуруп 6.0х35 мм», «Круг отрезной 125х1.6х22.2», «10х100х160 мм бур».
 * Первое число — всегда диаметр, второе у крепежа — длина, а у оснастки
 * толщина круга, поэтому длину разбираем не везде (см. SECTION_SIZES).
 *
 * «4.0» и «4» — один и тот же размер, поэтому число нормализуется: «4.0х8» и
 * «4х8» попадают в одно значение фильтра.
 */

const SIZE = /(\d+(?:[.,]\d+)?)\s*[хx]\s*(\d+(?:[.,]\d+)?)/;

export type SizeAxis = 'diameter' | 'length';

export const SIZE_LABEL: Record<SizeAxis, string> = {
  diameter: 'Диаметр, мм',
  length: 'Длина, мм'
};

/** Подпись выбранного значения на плашке: «Диаметр 3.2 мм». */
export const sizeChip = (axis: SizeAxis, value: string) =>
  `${SIZE_LABEL[axis].replace(/,.*$/, '')} ${value} мм`;

/** Какие размеры показывать в разделе. Общего списка нет: 125 мм круга и 3.5 мм самореза в одном фильтре не уживаются. */
export const SECTION_SIZES: Record<string, SizeAxis[]> = {
  krepezh: ['diameter', 'length'],
  'osnastka-k-elektroinstrumentu': ['diameter']
};

const num = (raw: string) => {
  const value = Number(raw.replace(',', '.'));
  return Number.isFinite(value) ? String(value) : '';
};

const CACHE = new WeakMap<Product, Record<SizeAxis, string>>();

export const productSize = (product: Product): Record<SizeAxis, string> => {
  let entry = CACHE.get(product);
  if (!entry) {
    const match = SIZE.exec(product.title);
    entry = {
      diameter: match ? num(match[1]) : '',
      length: match ? num(match[2]) : ''
    };
    CACHE.set(product, entry);
  }
  return entry;
};

/** Значения размера по возрастанию: 3.5 перед 10, а не наоборот, как вышло бы по алфавиту. */
export const bySize = (a: [string, number], b: [string, number]) => Number(a[0]) - Number(b[0]);
