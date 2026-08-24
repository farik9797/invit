import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { SectionIcon } from '../../lib/sectionIcons';
import { paths } from '../../routes';
import { Reveal, RevealGroup } from '../Reveal';

/*
 * Категории на главной.
 *
 * Пробовали две крупные карточки с описанием и списком подразделов в две
 * колонки — клиент сказал, что читается тяжело. Потом ставили фото товаров.
 * В итоге клиент прислал tbmmarket.by: там линейные пиктограммы, их и ставим.
 * Плитка = иконка, название, счётчик. Ни описаний, ни вложенных списков.
 */

const plural = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'позиций';
  const mod10 = n % 10;
  if (mod10 === 1) return 'позиция';
  if (mod10 >= 2 && mod10 <= 4) return 'позиции';
  return 'позиций';
};

/** Классы перечислены целиком: Tailwind не собирает имена по частям. */
const COLUMNS: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5'
};

const columnsFor = (count: number) =>
  COLUMNS[count % 5 === 0 ? 5 : count % 4 === 0 ? 4 : 3];

const GROUPS = CATEGORIES.map((category) => ({
  slug: category.slug,
  name: category.name,
  count: PRODUCTS.filter((p) => p.categorySlug === category.slug).length,
  tiles: category.subcategories.map((sub) => ({
    slug: sub.slug,
    name: sub.name,
    count: PRODUCTS.filter((p) => p.subcategorySlug === sub.slug).length
  }))
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

      {GROUPS.map((group) => (
        <div key={group.slug} className="mt-10">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-line">
              <h3 className="text-base sm:text-lg font-semibold text-ink">
                <Link
                  to={paths.category(group.slug)}
                  className="inline-flex items-center min-h-11 sm:min-h-0 hover:text-brand-blue transition-colors"
                >
                  {group.name}
                </Link>
              </h3>
              <span className="text-xs text-ink/50 tabular-nums whitespace-nowrap">
                {group.count} {plural(group.count)}
              </span>
            </div>
          </Reveal>

          <RevealGroup
            className={`mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 ${columnsFor(group.tiles.length)}`}
          >
            {group.tiles.map((tile) => (
              <Link
                key={tile.slug}
                to={`${paths.category(group.slug)}?sub=${tile.slug}`}
                className="group flex h-full flex-col rounded-xl border border-line bg-white overflow-hidden transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brand-blue hover:shadow-lg"
              >
                <span className="flex h-24 sm:h-28 items-center justify-center bg-surface-soft text-brand-blue">
                  <SectionIcon
                    slug={tile.slug}
                    className="w-10 h-10 sm:w-12 sm:h-12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                  />
                </span>

                <span className="flex flex-1 flex-col gap-1 border-t border-line p-3 sm:p-4">
                  <span className="text-xs sm:text-[13px] font-semibold leading-snug text-ink group-hover:text-brand-blue transition-colors">
                    {tile.name}
                  </span>
                  <span className="mt-auto text-[11px] text-ink/45 tabular-nums">
                    {tile.count} {plural(tile.count)}
                  </span>
                </span>
              </Link>
            ))}
          </RevealGroup>
        </div>
      ))}
    </div>
  </section>
);
