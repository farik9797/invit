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

export interface ProductSpec {
  label: string;
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
  badge?: 'Хит' | 'Новинка' | 'Акция' | 'Собственное производство';
  specs: ProductSpec[];
  sizes?: ProductSizes;
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

export interface OrderStatus {
  orderNumber: string;
  companyName: string;
  date: string;
  status: 'received' | 'cutting' | 'packed' | 'shipped' | 'delivered';
  statusText: string;
  estimatedDelivery: string;
  destination: string;
  itemsCount: number;
  weight: string;
  steps: {
    title: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
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
}

export interface QuoteCartItem {
  product: Product;
  selectedWidth: string;
  quantity: number; // number of rolls / meters / boxes
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
