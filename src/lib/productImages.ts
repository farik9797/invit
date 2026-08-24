import { Product } from '../types';
import windowsBanner from '../assets/categories/windows.webp';
import ventilationBanner from '../assets/categories/ventilyaciya.webp';

/**
 * Фото товаров лежат у нас, а не тянутся с invit.by.
 *
 * Причина: оригиналы там PNG по 500px и в среднем 53 КБ, а превью всего 208px
 * и мылит в сетке. Те же кадры, пережатые в WebP 500px, весят в среднем 12 КБ:
 * страница раздела стала легче (0,62 -> ~0,3 МБ) и при этом чётче.
 *
 * Файлы собраны скриптом из `imageLarge` каждой позиции, имя файла это id
 * товара, приведённый к латинице и дефисам. Пересобирать при обновлении каталога.
 */
const FILES = import.meta.glob('../assets/products/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const BY_NAME: Record<string, string> = {};
for (const [path, url] of Object.entries(FILES)) {
  const name = path.split('/').pop()!.replace(/\.webp$/, '');
  BY_NAME[name] = url;
}

/** Такое же приведение имени, как в скрипте выгрузки. */
const fileName = (id: string) =>
  id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Локальное фото товара; если его нет, отдаём исходный адрес с invit.by. */
export const productImage = (product: Product) =>
  BY_NAME[fileName(product.id)] ?? product.imageLarge ?? product.image;

/**
 * Галерея: первым кадром идёт локальное фото, остальные иллюстрации
 * остаются на invit.by и грузятся лениво.
 */
export const productGallery = (product: Product, extra: string[]) => {
  const main = productImage(product);
  return [main, ...extra.slice(1)];
};

/**
 * Баннеры разделов каталога. Собраны локально в 1280x352 (двойной размер бокса),
 * потому что на invit.by картинок такой ширины нет: раздел окон это кадр из фото
 * героя, вентиляция собрана из товарного снимка на белом — сцены для неё
 * у клиента просто не существует.
 */
const CATEGORY_BANNERS: Record<string, string> = {
  'materialy-dlya-okon': windowsBanner,
  ventilyaciya: ventilationBanner
};

export const categoryBanner = (slug: string, fallback: string) =>
  CATEGORY_BANNERS[slug] ?? fallback;

/**
 * Сканы документов тоже лежат у нас: они висели на invit.by, и когда сайт
 * клиента был недоступен, страница документации превращалась в пустые рамки.
 * Оригиналы 700x700, пережаты в WebP quality 80 (по 50 КБ вместо 150-200).
 */
const CERT_FILES = import.meta.glob('../assets/certificates/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

const CERTS: Record<string, string> = {};
for (const [path, url] of Object.entries(CERT_FILES)) {
  CERTS[path.split('/').pop()!.replace(/\.webp$/, '')] = url;
}

export const certificateImage = (id: string, fallback: string) => CERTS[id] ?? fallback;
