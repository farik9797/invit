import { Product } from '../types';

/*
 * Цены пришли из выгрузок поставщиков: 4361 карточка из 5124. У остальных —
 * это позиции со старого invit.by — цены в выгрузке нет вовсе, и придумывать
 * её нельзя: показываем «по запросу».
 */

/*
 * Цены на витрине выключены: клиент попросил показывать «по запросу» у всех
 * позиций. Данные из выгрузки остаются на месте, вместе с ними — фильтр и
 * сортировка по цене: вернуть всё это можно одной строкой, не пересобирая
 * каталог.
 */
export const PRICES_SHOWN = false;

const RUBLES = new Intl.NumberFormat('ru-BY', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const formatPrice = (value: number) => `${RUBLES.format(value)} р.`;

/** Подпись цены для карточки: «12,58 р.», «от 12,58 р.» или «по запросу». */
export const priceLabel = (product: Product): string => {
  if (!PRICES_SHOWN || product.price === undefined) return 'Цена по запросу';
  return product.priceMax !== undefined
    ? `от ${formatPrice(product.price)}`
    : formatPrice(product.price);
};

export const hasPrice = (product: Product) => PRICES_SHOWN && product.price !== undefined;

/** Подпись плашки с выбранным диапазоном: «от 5 р.», «до 20 р.», «5 — 20 р.». */
export const priceChip = ({ min, max }: { min: number | null; max: number | null }) => {
  if (min !== null && max !== null) return `${min} — ${max} р.`;
  return min !== null ? `от ${min} р.` : `до ${max} р.`;
};
