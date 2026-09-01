import { Product } from '../types';

/*
 * Поиск был плоским includes() по title+shortTitle+subcategoryName без
 * ранжирования и без транслитерации. Отсюда две жалобы клиента:
 *
 * 1. Запрос «очиститель» — это слово входит в НАЗВАНИЕ ПОДКАТЕГОРИИ
 *    «Пена монтажная, очиститель для пены», поэтому в выдачу попадала
 *    вся пена этой подкатегории (15 позиций), а настоящие очистители
 *    (8 позиций) тонули среди них вперемешку. Без ранжирования подкатегория
 *    и заголовок весили одинаково.
 * 2. Запрос «космофен» ничего не находил: в каталоге бренд написан
 *    латиницей — COSMOFEN. Обычный includes() кириллицу с латиницей
 *    не сопоставляет.
 *
 * Правки: (а) совпадение в заголовке весит больше совпадения в названии
 * подкатегории, результат сортируется по весу; (б) кириллические названия
 * брендов (и общая транслитерация запроса) добавляются как алиасы поиска.
 */

/** Кириллические варианты брендов каталога — пишутся в товарах латиницей. */
const BRAND_ALIASES: Record<string, string> = {
  старфикс: 'starfix',
  стартул: 'startul',
  евробанд: 'euroband',
  миксфор: 'mixfor',
  топтул: 'toptul',
  космофен: 'cosmofen',
  космо: 'cosmo',
  вортекс: 'wortex',
  джета: 'jeta',
  соудал: 'soudal',
  судал: 'soudal',
  фискарс: 'fiskars',
  бернер: 'berner',
  арктик: 'arctic',
  хаузер: 'hauser',
  ультима: 'ultima',
  зум: 'zoom'
};

const TRANSLIT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya'
};

const transliterate = (s: string) =>
  s
    .split('')
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join('')
    // «кс» на конце частый эквивалент «x» в бренд-именах (старфикс -> starfix,
    // а не starfiks)
    .replace(/ks\b/g, 'x');

/** Запрос как есть плюс латинские варианты через транслитерацию и алиасы брендов. */
const expandQuery = (rawNeedle: string): string[] => {
  const terms = new Set<string>([rawNeedle]);

  for (const [ru, latin] of Object.entries(BRAND_ALIASES)) {
    if (rawNeedle.includes(ru)) terms.add(rawNeedle.replace(ru, latin));
  }

  const translit = transliterate(rawNeedle);
  if (translit && translit !== rawNeedle) terms.add(translit);

  return [...terms];
};

/** Заголовок весит больше названия подкатегории, начало строки — больше середины. */
const scoreProduct = (product: Product, terms: string[]): number => {
  const title = product.title.toLowerCase();
  const short = product.shortTitle.toLowerCase();
  const sub = product.subcategoryName.toLowerCase();

  let best = 0;
  for (const term of terms) {
    if (!term) continue;
    if (title.startsWith(term) || short.startsWith(term)) best = Math.max(best, 3);
    else if (title.includes(term) || short.includes(term)) best = Math.max(best, 2);
    else if (sub.includes(term)) best = Math.max(best, 1);
  }
  return best;
};

/** Фильтрует и сортирует товары по релевантности запросу; пустой запрос — список без изменений. */
export const searchProducts = (products: Product[], query: string): Product[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;

  const terms = expandQuery(needle);

  return products
    .map((product) => ({ product, score: scoreProduct(product, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.product);
};
