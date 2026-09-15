import { Product } from '../types';
import { PRODUCTS } from '../data/catalogData';

/*
 * «С этим товаром часто покупают».
 *
 * Данных о том, что покупают вместе, у нас нет: заказ уходит письмом, историю
 * корзин никто не собирает. Поэтому подбор не по статистике, а по делу — для
 * каждого раздела перечислены подразделы, без которых работу не сделать: шов
 * ставят вместе с пеной и герметиком, кровельный саморез — со сверлом и
 * очками. Появится история заказов — правило заменится настоящей статистикой.
 *
 * Свой подраздел в спутники не берём: то же самое уже показано ниже в блоке
 * «Другие позиции раздела».
 */

const COMPANIONS: Record<string, string[]> = {
  'materialy-dlya-okon': [
    'pistolety-dlya-peny',
    'germetiki-silikonovye',
    'samorez-okonnyy-ostryy',
    'himiya-dlya-okon-cosmofen'
  ],
  germetiki: [
    'pistolety-dlya-germetika',
    'himiya-dlya-okon-cosmofen',
    'malyarnaya-lenta',
    'perchatki'
  ],
  'kley-himiya-smazki': ['pistolety-dlya-germetika', 'malyarnaya-lenta', 'perchatki'],
  'uplotnitelnye-lenty-pes-samokleyaschiesy': [
    'samorez-krovelnyy',
    'germetiki-silikonovye',
    'instrument-rezhuschiy'
  ],
  'krovelnye-uplotniteli-kleykie-lenty': [
    'samorez-krovelnyy',
    'germetiki-silikonovye',
    'alyuminievye-lenty-alu'
  ],
  'uplotnitel-rezinovyy-d-p-e': [
    'himiya-dlya-okon-cosmofen',
    'smazki-aerozolnye',
    'instrument-rezhuschiy'
  ],
  krepezh: [
    'osnastka-dlya-dreley-shurupovertov',
    'sverlenie',
    'instrument-krepyozhnyy',
    'perchatki'
  ],
  'alyuminievye-armirovannye-lenty': ['izolyacionnye-lenty', 'instrument-rezhuschiy', 'perchatki'],
  ventilyaciya: [
    'alyuminievye-lenty-alu',
    'dyubel-raspornyy',
    'shpilka-rezbovaya',
    'instrument-krepyozhnyy'
  ],
  'instrument-oborudovanie': ['osnastka-dlya-dreley-shurupovertov', 'ochki', 'perchatki'],
  'siz-rashodnye-materialy': ['perchatki', 'ochki', 'maski', 'plyonka-ukryvochnaya'],
  'osnastka-k-elektroinstrumentu': ['ochki', 'perchatki', 'maski', 'naushniki']
};

/** Товары подраздела: сначала наши, потом со снимком и с ценой — витринные. */
const pickFrom = (subSlug: string, exclude: string): Product[] =>
  PRODUCTS.filter((p) => p.subcategorySlug === subSlug && p.id !== exclude).sort((a, b) => {
    const weight = (p: Product) =>
      (p.badge === 'Собственное производство' ? 0 : 4) +
      (p.image ? 0 : 2) +
      (p.price !== undefined ? 0 : 1);
    return weight(a) - weight(b);
  });

/** До `limit` спутников, по одному из каждого подраздела: подборка не должна быть из одних перчаток. */
export const crossSell = (product: Product, limit = 4): Product[] => {
  const groups = (COMPANIONS[product.categorySlug] ?? []).filter(
    (slug) => slug !== product.subcategorySlug
  );
  if (!groups.length) return [];

  const pools = groups.map((slug) => pickFrom(slug, product.id));
  const out: Product[] = [];

  for (let round = 0; out.length < limit; round += 1) {
    const before = out.length;
    for (const pool of pools) {
      if (out.length >= limit) break;
      if (pool[round]) out.push(pool[round]);
    }
    if (out.length === before) break;     // пулы кончились
  }

  return out;
};
