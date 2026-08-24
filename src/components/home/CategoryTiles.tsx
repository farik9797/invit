import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { categoryBanner } from '../../lib/productImages';
import { paths } from '../../routes';
import { Reveal, RevealGroup } from '../Reveal';

/*
 * На главной раньше шли плитки подразделов лент, а следом сетка товаров —
 * получались «товары и товары». Теперь здесь именно категории каталога, две
 * штуки, с подразделами и счётчиками. Список сопутствующих товаров убран
 * по просьбе клиента: он занимал экран и дублировал каталог.
 */

const plural = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'позиций';
  const mod10 = n % 10;
  if (mod10 === 1) return 'позиция';
  if (mod10 >= 2 && mod10 <= 4) return 'позиции';
  return 'позиций';
};

const CATEGORY_CARDS = CATEGORIES.map((category) => ({
  slug: category.slug,
  name: category.name,
  description: category.description,
  image: categoryBanner(category.slug, category.image),
  count: PRODUCTS.filter((p) => p.categorySlug === category.slug).length,
  subs: category.subcategories.slice(0, 5)
}));

export const CategoryTiles: React.FC = () => (
  <section className="py-16 sm:py-20 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5">
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-brand-green">Каталог</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              Категории продукции
            </h2>
          </div>

          <Link
            to={paths.catalog}
            className="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
          >
            Весь каталог
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>

      <RevealGroup className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CATEGORY_CARDS.map((category) => (
          <div
            key={category.slug}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white"
          >
            <Link
              to={paths.category(category.slug)}
              className="group relative block h-44 overflow-hidden"
            >
              <img
                src={category.image}
                alt={category.name}
                width={1280}
                height={352}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              />
              {/* Заливка слева направо: текст на тёмном, фото справа чистое */}
              <span className="absolute inset-0 bg-gradient-to-r from-ink/90 from-20% via-ink/55 via-55% to-ink/10" />
              <span className="absolute bottom-4 left-5 right-5 text-white">
                <span className="block text-[11px] font-semibold text-white/75 tabular-nums">
                  {category.count} {plural(category.count)}
                </span>
                <span className="mt-1 block text-lg sm:text-xl font-bold leading-snug">
                  {category.name}
                </span>
              </span>
            </Link>

            <div className="flex flex-1 flex-col gap-4 p-5">
              <p className="text-xs leading-relaxed text-ink/70">{category.description}</p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {category.subs.map((sub) => (
                  <li key={sub.id} className="border-b border-line">
                    <Link
                      to={`${paths.category(category.slug)}?sub=${sub.slug}`}
                      className="flex items-center justify-between gap-3 min-h-11 py-2 text-xs text-ink/80 hover:text-brand-blue transition-colors"
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="shrink-0 text-[11px] text-ink/40 tabular-nums">
                        {sub.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                to={paths.category(category.slug)}
                className="mt-auto inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
              >
                Открыть раздел
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </RevealGroup>
    </div>
  </section>
);
