import { Product } from '../types';
import { productImage } from './productImages';
import { CONTENT_IMAGE_MAP } from './contentImageMap';

/*
 * Отдельный модуль ради веса главной страницы: карта на 257 адресов и ссылки
 * на 255 файлов нужны только там, где рисуется описание товара. Если держать
 * их в productImages.ts, который импортирует карточка товара в сетке, всё это
 * уезжает в основной бандл.
 */

/**
 * Иллюстрации из описаний товаров. Тоже лежат у нас: их 255 штук, все висели
 * на invit.by, и при его недоступности описания превращались в пустые рамки.
 * Приведены к WebP шириной до 900px, в среднем 14 КБ вместо 40-60 КБ.
 */
const CONTENT_FILES = import.meta.glob('../assets/content/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const CONTENT: Record<string, string> = {};
for (const [path, url] of Object.entries(CONTENT_FILES)) {
  CONTENT[path.split('/').pop()!.replace(/\.webp$/, '')] = url;
}

/** Локальная копия иллюстрации; если её нет, отдаём исходный адрес. */
export const contentImage = (remoteUrl: string) => {
  const file = CONTENT_IMAGE_MAP[remoteUrl];
  return (file && CONTENT[file]) || remoteUrl;
};

/**
 * Галерея: первым кадром идёт локальное фото, остальные иллюстрации
 * остаются на invit.by и грузятся лениво.
 */
export const productGallery = (product: Product, extra: string[]) => {
  const main = productImage(product);
  return [main, ...extra.slice(1).map((url) => contentImage(url))];
};
