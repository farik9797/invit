/*
 * Данные React-сайта, которые нужны теме WordPress как есть: разделы с
 * группами и описаниями, знаки разделов, новости, документы, реквизиты.
 * Собирается esbuild-ом из scripts/build-theme-data.sh и печатает JSON.
 */
import { CATEGORIES, NEWS, CERTIFICATES, PRODUCTS } from '../../src/data/catalogData';
import { DRAWN_ICONS } from '../../src/lib/sectionIconsDrawn';
import { TAPE_SUBCATEGORIES } from '../../src/lib/product';
import { COMPANY, REQUISITES, REQUISITES_COMPACT } from '../../src/data/company';
import { DATASHEETS } from '../../src/data/datasheets';
import { PRODUCT_CONTENT } from '../../src/data/productContent';
import { CONTENT_IMAGE_MAP } from '../../src/lib/contentImageMap';
import { LIBRARY } from '../../src/data/library';

/*
 * В WordPress товар узнаётся по адресу (post_name), а описания и листы в React
 * лежат по идентификатору. Расходятся они у позиций с «%27» в идентификаторе,
 * поэтому перекладываем ключи на адрес.
 */
const SLUG = new Map(PRODUCTS.map((p) => [p.id, p.slug]));
const bySlug = <T,>(record: Record<string, T>) =>
  Object.fromEntries(Object.entries(record).map(([id, value]) => [SLUG.get(id) ?? id, value]));

/** Вторая прописка товара: адрес -> подраздел, где он «в гостях». */
const ALSO = Object.fromEntries(
  PRODUCTS.filter((p) => p.alsoSubcategorySlug).map((p) => [p.slug, p.alsoSubcategorySlug])
);

console.log(
  JSON.stringify({
    categories: CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      subcategories: c.subcategories.map((s) => ({ slug: s.slug, name: s.name, group: s.group ?? '' }))
    })),
    drawnIcons: DRAWN_ICONS,
    tapeSubcategories: TAPE_SUBCATEGORIES,
    news: NEWS.map(({ id, title, date, category, content }) => ({ id, title, date, category, content })),
    certificates: CERTIFICATES,
    company: COMPANY,
    requisites: REQUISITES,
    requisitesCompact: REQUISITES_COMPACT,
    datasheets: bySlug(DATASHEETS),
    productContent: bySlug(PRODUCT_CONTENT),
    alsoSub: ALSO,
    contentImageMap: CONTENT_IMAGE_MAP,
    library: LIBRARY
  })
);
