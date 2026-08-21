import { Product } from './types';

/** Единая точка правды по адресам страниц. */
export const paths = {
  home: '/',
  catalog: '/catalog',
  category: (slug: string) => `/catalog/${slug}`,
  product: (product: Product) => `/catalog/${product.categorySlug}/${productSlug(product)}`,
  about: '/about',
  certificates: '/certificates',
  news: '/news',
  newsArticle: (id: string) => `/news/${id}`,
  contacts: '/contacts'
};

export const productSlug = (product: Product) => product.slug;
