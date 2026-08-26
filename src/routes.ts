import { Product } from './types';

/** Единая точка правды по адресам страниц. */
export const paths = {
  home: '/',
  homeV2: '/v2',
  catalog: '/catalog',
  category: (slug: string) => `/catalog/${slug}`,
  product: (product: Product) => `/catalog/${product.categorySlug}/${productSlug(product)}`,
  about: '/about',
  // Архив: первая версия страницы, сохранена для сравнения
  aboutOld: '/about-old',
  certificates: '/certificates',
  news: '/news',
  newsArticle: (id: string) => `/news/${id}`,
  contacts: '/contacts',
  cart: '/cart'
};

export const productSlug = (product: Product) => product.slug;
