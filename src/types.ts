export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  subcategories: SubCategory[];
  division: 'windows' | 'hvac';
}

/** Блок описания товара в исходном порядке со страницы invit.by. */
export type ContentBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'text'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'image'; src: string };

export interface ProductContent {
  images: string[];
  blocks: ContentBlock[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

/** Исполнение товара: строка выгрузки, свёрнутая в вариацию карточки. */
export interface ProductVariant {
  sku: string;
  title: string;
  /** Значение оси: «10х345х460 мм», «RAL 8017», «размер L». */
  value: string;
}

/** Размерный ряд с сайта: шапка таблицы и строки. */
export interface ProductSizes {
  headers: string[];
  rows: string[][];
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  categorySlug: string;
  subcategorySlug: string;
  subcategoryName: string;
  division: 'windows' | 'hvac';
  description: string;
  image: string;
  imageLarge?: string;
  /** Артикул поставщика — есть только у товаров из прайса STARFIX/STARTUL. */
  sku?: string;
  badge?: 'Хит' | 'Новинка' | 'Акция' | 'Собственное производство';
  specs: ProductSpec[];
  sizes?: ProductSizes;
  /** Чем различаются исполнения: «Типоразмер», «Цвет», «Длина». */
  variantLabel?: string;
  variants?: ProductVariant[];
  features: string[];
  datasheetUrl?: string;
  sourceUrl: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlight: string;
  image: string;
  categoryLink: string;
  features: string[];
}

export interface CertificateItem {
  id: string;
  title: string;
  type: string;
  image: string;
  /** Скан в полном разрешении. */
  imageFull?: string;
  /** Страница-источник на invit.by, если документ опубликован там. */
  sourceUrl?: string;
  issuedBy?: string;
  validUntil?: string;
  pdfUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
  image: string;
  /** Страница-источник на invit.by. */
  sourceUrl?: string;
}

export interface QuoteCartItem {
  /** Ключ строки: id товара, а у товара с исполнениями — id и выбранное. */
  key: string;
  product: Product;
  /** Выбранное исполнение: «10х345х460 мм», «RAL 8017». */
  variant?: string;
  quantity: number; // рулоны / метры / штуки
}

export interface QuoteFormData {
  name: string;
  company: string;
  unp: string; // УНП (Tax ID in Belarus)
  phone: string;
  email: string;
  city: string;
  comment: string;
  attachedFileName?: string;
}
