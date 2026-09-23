import React from 'react';
import { PRODUCTS } from '../data/catalogData';
import { productImage } from './productImages';
import { SectionIcon } from './sectionIcons';

/*
 * Знак раздела — снимок товара из него, а не пиктограмма.
 *
 * Берём первый товар со снимком: выгрузка идёт группами, поэтому первый
 * показывает раздел не хуже любого другого, а выбор не меняется от сборки
 * к сборке. Снимки уже лежат в public/products — ничего не догружаем сверх
 * того, что каталог и так отдаёт.
 *
 * У 25 подразделов (крепёж россыпью, плёнки, маски) снимка нет ни у одного
 * товара — там остаётся прежняя пиктограмма.
 */
const CATEGORY = new Map<string, string>();
const SUBCATEGORY = new Map<string, string>();

for (const product of PRODUCTS) {
  const photo = productImage(product);
  if (!photo) continue;
  if (!CATEGORY.has(product.categorySlug)) CATEGORY.set(product.categorySlug, photo);
  if (!SUBCATEGORY.has(product.subcategorySlug)) SUBCATEGORY.set(product.subcategorySlug, photo);
}

/** Снимок раздела или подраздела; пустая строка, если снимка нет. */
export const sectionPhoto = (slug: string) =>
  SUBCATEGORY.get(slug) ?? CATEGORY.get(slug) ?? '';

export const SectionMark: React.FC<{ slug: string; size: number; className?: string }> = ({
  slug,
  size,
  className = ''
}) => {
  const photo = sectionPhoto(slug);

  if (!photo) return <SectionIcon slug={slug} size={size} className={className} />;

  return (
    <img
      src={photo}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className={`${className} object-contain`}
    />
  );
};
