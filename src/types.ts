export interface SubCategory {
  id: string;
  name: string;
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

export interface Product {
  id: string;
  code: string; // e.g. EB-7025-IN
  title: string;
  categorySlug: string;
  subcategoryName: string;
  division: 'windows' | 'hvac';
  description: string;
  image: string;
  badge?: 'Хит' | 'Новинка' | 'Акция' | 'Собственное производство';
  specs: {
    width?: string;
    length?: string;
    density?: string;
    tempRange?: string;
    thickness?: string;
    material?: string;
    packaging?: string;
    class?: string;
  };
  features: string[];
  inStock: boolean;
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
  validUntil: string;
  issuedBy: string;
  image: string;
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
