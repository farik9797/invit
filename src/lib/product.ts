import { Product } from '../types';

/**
 * Варианты исполнения для корзины. Берём первый столбец размерного ряда с сайта
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

/**
 * В выдаче раздела собственное производство EUROBAND показываем первым, следом
 * позиции со снимком.
 *
 * Снимок есть не у всех: у поставщика оснастки его нет для половины позиций, у
 * пены — для двух третей. Без этого правила порядок оставался как в выгрузке, и
 * первый экран раздела мог целиком состоять из карточек без фото.
 */
export const sortForListing = (products: Product[]) =>
  [...products].sort((a, b) => {
    const weight = (p: Product) =>
      (p.badge === 'Собственное производство' ? 0 : 2) + (p.image ? 0 : 1);
    return weight(a) - weight(b);
  });

/**
 * EUROBAND — это только ленты. Остальные разделы каталога (пена, герметики, крепёж,
 * инструмент, вентиляция) — сопутствующие товары прямой поставки, не наше производство.
 */
export const TAPE_SUBCATEGORIES = [
  'montazhnye-lenty-dlya-okon',
  'samorasshiryayuschayasya-lenta-psul',
  'polnobutilovye-lenty',
  'zvukoizolyacionnaya-lenta',
  'pes-mezhflancevaya-lenta',
  'pes-lenta-pod-kontrobreshyotku',
  'lenta-dlya-sendvich-paneley',
  'shumopogloschayuschaya-lenta',
  'dempfernaya-lenta',
  'lenta-butilkauchukovaya-lb',
  'lenta-butilkauchukovaya-lba'
];

export const isTape = (product: Product) => TAPE_SUBCATEGORIES.includes(product.subcategorySlug);

/*
 * «Также для монтажа кровли доступны:» и такие же перечни в конце описания.
 *
 * На invit.by это были ссылки на сопутствующие товары. При переносе разметка
 * потерялась, и остался список названий, по которым никуда не перейти. Его
 * работу делает блок «Другие позиции раздела» под карточкой, поэтому перечень
 * убираем вместе с его заголовком.
 */
const CROSS_SELL = /доступны\s*:?\s*$/i;

/**
 * Описание товара на invit.by дублируется: тот же абзац идёт и в кратком
 * описании, и первым блоком в подробном. На странице товара это выглядит так,
 * будто текст напечатали дважды. Убираем повтор и заголовок, который после
 * этого остался бы пустым.
 */
export const dedupeContentBlocks = <T extends { kind: string }>(
  blocks: T[],
  description: string
): T[] => {
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
  const target = norm(description);

  const isDuplicate = (b: T) => {
    // Без краткого описания сверять не с чем, но перечни ссылок убрать надо
    if (!target || b.kind !== 'text') return false;
    const text = norm((b as unknown as { text: string }).text);
    if (!text) return true;
    const head = 80;
    return (
      text === target ||
      text.startsWith(target.slice(0, head)) ||
      target.startsWith(text.slice(0, head))
    );
  };

  const kept = blocks.filter((b, idx) => {
    if (isDuplicate(b)) return false;
    const text = (b as unknown as { text?: string }).text ?? '';
    if (b.kind === 'heading' && CROSS_SELL.test(text)) return false;
    // список сразу за таким заголовком — те самые бывшие ссылки
    const prev = blocks[idx - 1] as unknown as { kind: string; text?: string } | undefined;
    if (b.kind === 'list' && prev?.kind === 'heading' && CROSS_SELL.test(prev.text ?? '')) {
      return false;
    }
    return true;
  });

  // Заголовок без содержимого до следующего заголовка больше не нужен
  return kept.filter((b, idx) => {
    if (b.kind !== 'heading') return true;
    const next = kept[idx + 1];
    return Boolean(next) && next.kind !== 'heading';
  });
};
