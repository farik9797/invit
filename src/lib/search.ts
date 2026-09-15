import { Product } from '../types';

/*
 * Поиск по каталогу.
 *
 * Данные поставщиков написаны как придётся: бренды латиницей (STARFIX,
 * MAKITA), названия кириллицей, размеры то через точку, то через запятую
 * («3.2х8» и «3,2x8»), а «х» в размере бывает и кириллическая, и латинская —
 * на глаз они неотличимы, и человек набирает ту, что под рукой.
 *
 * Поэтому и запрос, и текст товара приводятся к одному виду: нижний регистр,
 * «ё» как «е», точка и запятая — один знак, обе «х» — один знак, кириллица
 * переписывается латиницей. Дальше сравниваются уже одинаково написанные
 * строки.
 *
 * Слова запроса ищутся независимо и в любом порядке: «лента псул» находит
 * «Лента ПСУЛ EUROBAND» и «ПСУЛ-лента для окон».
 */

/** Кириллица латиницей. «х» здесь нет: она разбирается раньше, вместе с «x». */
const CYRILLIC: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's',
  т: 't', у: 'u', ф: 'f', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y',
  ь: '', э: 'e', ю: 'yu', я: 'ya'
};

/**
 * Единое написание строки. Применяется и к запросу, и к названию товара,
 * поэтому важно не что получится, а чтобы получалось одинаково с обеих сторон.
 */
export const fold = (text: string): string =>
  text
    .toLowerCase()
    .replace(/ё/g, 'е')
    // Точка и запятая в размерах — один и тот же знак: «3,2» и «3.2»
    .replace(/[.,]/g, '.')
    // Кириллическая «х» и латинская «x» неотличимы на глаз: «10х100» и «10x100»
    .replace(/[хx]/g, 'x')
    .replace(/[а-я]/g, (ch) => CYRILLIC[ch] ?? ch)
    // «кс» на конце — частый эквивалент «x» в брендах: старфикс → starfix
    .replace(/ks\b/g, 'x')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Бренды, которые переписыванием не сходятся: в каталоге они латиницей, а
 * кириллическое написание даёт другие буквы (к vs c, дж vs j).
 * Ключи и значения уже приведены fold().
 */
const ALIAS: Record<string, string> = {
  bosh: 'bosch',
  evroband: 'euroband',
  miksfor: 'mixfor',
  kosmofen: 'cosmofen',
  kosmo: 'cosmo',
  dzheta: 'jeta',
  arktik: 'arctic',
  xauzer: 'hauser',
  zum: 'zoom',
  sudal: 'soudal',
  abrafors: 'abraforce',
  lugaabraziv: 'lugaabrasiv',
  daymond: 'diamond'
};

/*
 * Русская раскладка, набранная латиницей: человек забыл переключить клавиатуру
 * и получил «uthvtnbr» вместо «герметик». Сопоставление идёт по клавишам
 * ЙЦУКЕН, поэтому работает в обе стороны — «ыефкашч» тоже находит STARFIX.
 */
const LAYOUT: Record<string, string> = {
  q: 'й', w: 'ц', e: 'у', r: 'к', t: 'е', y: 'н', u: 'г', i: 'ш', o: 'щ',
  p: 'з', '[': 'х', ']': 'ъ', a: 'ф', s: 'ы', d: 'в', f: 'а', g: 'п',
  h: 'р', j: 'о', k: 'л', l: 'д', ';': 'ж', "'": 'э', z: 'я', x: 'ч',
  c: 'с', v: 'м', b: 'и', n: 'т', m: 'ь', ',': 'б', '.': 'ю', '/': '.'
};

const BACK: Record<string, string> = Object.fromEntries(
  Object.entries(LAYOUT).map(([latin, cyrillic]) => [cyrillic, latin])
);

const swapLayout = (text: string) =>
  text
    .toLowerCase()
    .split('')
    .map((ch) => LAYOUT[ch] ?? BACK[ch] ?? ch)
    .join('');

/** Написания одного слова запроса, которые считаем равными. */
const variants = (term: string): string[] => {
  const alias = ALIAS[term];
  return alias ? [term, alias] : [term];
};

/*
 * Приведённые названия держим в памяти: 5124 товара, и пересчитывать их на
 * каждое нажатие клавиши в подсказке — заметная работа впустую.
 */
const CACHE = new WeakMap<Product, { title: string; sku: string }>();

const folded = (product: Product) => {
  let entry = CACHE.get(product);
  if (!entry) {
    entry = { title: fold(product.title), sku: fold(product.sku ?? '') };
    CACHE.set(product, entry);
  }
  return entry;
};

const atWordStart = (hay: string, term: string) =>
  hay.startsWith(term) || hay.includes(` ${term}`) || hay.includes(`-${term}`);

/*
 * Вес: точный артикул > артикул частью > все слова с начала слова в названии >
 * просто вхождение. Ищем только по названию и артикулу — в названии подраздела
 * искать нельзя: запрос «очиститель» вытаскивал всю пену из раздела
 * «Пена монтажная, очиститель для пены», хотя в самих товарах слова нет.
 */
const scoreProduct = (product: Product, query: string, terms: string[]): number => {
  const { title, sku } = folded(product);

  if (sku && sku === query) return 5;
  if (sku && sku.includes(query)) return 4;

  const found = terms.every((term) =>
    variants(term).some((v) => title.includes(v) || (sku && sku.includes(v)))
  );
  if (!found) return 0;

  const heads = terms.filter((term) =>
    variants(term).some((v) => atWordStart(title, v))
  ).length;

  if (heads === terms.length) return 3;
  return title.includes(query) ? 2 : 1;
};

const run = (products: Product[], needle: string): Product[] => {
  const terms = needle.split(' ').filter(Boolean);

  return products
    .map((product) => ({ product, score: scoreProduct(product, needle, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
};

/** Фильтрует и сортирует товары по соответствию запросу; пустой запрос — список без изменений. */
export const searchProducts = (products: Product[], query: string): Product[] => {
  const needle = fold(query);
  if (!needle) return products;

  const found = run(products, needle);
  if (found.length) return found;

  // Ничего не нашлось — возможно, забыли переключить раскладку. Пробуем ещё
  // раз с переложенными клавишами, но только вторым заходом: у запроса,
  // который и так что-то находит, подменять буквы нельзя.
  const swapped = fold(swapLayout(query));
  return swapped && swapped !== needle ? run(products, swapped) : [];
};
