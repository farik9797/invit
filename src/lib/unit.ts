import { Product } from '../types';
import { isTape } from './product';

/*
 * В чём считается товар. Отдельного поля поставщик не прислал, но у крепежа
 * фасовка написана в названии: «(1000 шт в коробе)», «(50 шт в уп.)» — 511
 * позиций. Считать их штуками неверно: со склада отгружают коробами, и «1» в
 * заказе — это короб на тысячу саморезов, а не один саморез.
 */

const PACK = /\((\d+)\s*шт\.?\s*в\s+(?:коробе|упаковке|уп\.?)\)/i;

export interface ProductUnit {
  /** Короткая подпись рядом с количеством: «упак.», «рул.», «шт.». */
  short: string;
  /** Что внутри упаковки: «по 1000 шт». Пусто, если товар штучный. */
  hint: string;
}

export const productUnit = (product: Product): ProductUnit => {
  const pack = PACK.exec(product.title);
  if (pack) return { short: 'упак.', hint: `по ${pack[1]} шт` };
  if (isTape(product)) return { short: 'рул.', hint: '' };
  return { short: 'шт.', hint: '' };
};
