import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { paths } from '../../routes';
import { TAPE_SUBCATEGORIES } from '../../lib/product';

interface Tile {
  name: string;
  count: number;
  image: string;
  href: string;
}

const buildTiles = (slugs: string[]): Tile[] =>
  slugs
    .map((slug) => {
      const category = CATEGORIES.find((c) => c.subcategories.some((s) => s.slug === slug));
      const sub = category?.subcategories.find((s) => s.slug === slug);
      const items = PRODUCTS.filter((p) => p.subcategorySlug === slug);
      if (!category || !sub || !items.length) return null;
      return {
        name: sub.name,
        count: items.length,
        image: items[0].image,
        href: `${paths.category(category.slug)}?sub=${sub.slug}`
      };
    })
    .filter((tile): tile is Tile => tile !== null);

const TAPES = buildTiles(TAPE_SUBCATEGORIES);

const RELATED = CATEGORIES.flatMap((category) =>
  category.subcategories
    .filter((sub) => !TAPE_SUBCATEGORIES.includes(sub.slug))
    .map((sub) => ({
      name: sub.name,
      count: sub.count ?? 0,
      href: `${paths.category(category.slug)}?sub=${sub.slug}`
    }))
);

export const CategoryTiles: React.FC = () => (
  <section className="py-16 sm:py-20 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
            Собственное производство
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
            Ленты EUROBAND
          </h2>
        </div>
        <p className="text-sm text-brand-navy/60 max-w-md lg:text-right">
          Производим сами: монтажные, бутилкаучуковые, ПСУЛ и уплотнительные ленты ПЭС.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {TAPES.map((tile) => (
          <Link
            key={tile.href}
            to={tile.href}
            className="group border border-line rounded-xl overflow-hidden hover:border-brand-sky transition-colors bg-surface"
          >
            <div className="aspect-4/3 bg-white overflow-hidden">
              <img
                src={tile.image}
                alt={tile.name}
                loading="lazy"
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4 border-t border-line">
              <h3 className="text-sm font-semibold text-brand-navy leading-snug group-hover:text-brand-blue transition-colors hyphens-auto break-words">
                {tile.name}
              </h3>
              <span className="mt-1 block text-xs text-brand-navy/50">{tile.count} позиций</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Сопутствующие товары — прямые поставки, не наше производство */}
      <div className="mt-12 pt-8 border-t border-line">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-5">
          <h3 className="text-base font-semibold text-brand-navy">Сопутствующие товары</h3>
          <span className="text-xs text-brand-navy/50">
            Прямые поставки: пена, герметики, крепёж, инструмент, комплектующие для вентиляции
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {RELATED.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="inline-flex items-center gap-2 border border-line hover:border-brand-sky hover:text-brand-blue rounded-lg px-3.5 py-2 text-xs text-brand-navy/80 transition-colors"
            >
              {item.name}
              <span className="text-brand-navy/40">{item.count}</span>
            </Link>
          ))}

          <Link
            to={paths.catalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
          >
            Весь каталог
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);
