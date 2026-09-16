import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Category } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { COUNT_CATEGORY, COUNT_SUB } from '../../lib/catalogCounts';
import { SectionIcon } from '../../lib/sectionIcons';
import { paths } from '../../routes';

/*
 * Разделы каталога списком в боковой колонке; подразделы выезжают вбок при
 * наведении.
 *
 * Деревом здесь стояли все подразделы сразу — у крепежа их двадцать два, у
 * оснастки семьдесят, и колонка вытягивалась на две тысячи точек. Выпадающая
 * панель убирает эту высоту, но список разделов остаётся на виду: по нему
 * ходят чаще всего.
 *
 * Выбранный раздел поднимается наверх списка: в нём человек сейчас и работает,
 * а искать его глазами среди двенадцати одинаковых строк не нужно.
 */

interface SectionsMenuProps {
  category: Category | null;
  activeSub: string | null;
  /** Выбор подраздела внутри текущего раздела — без сброса бренда и поиска. */
  onSub: (slug: string | null) => void;
}

export const SectionsMenu: React.FC<SectionsMenuProps> = ({ category, activeSub, onSub }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();

  // Открытый раздел — первым, остальные в прежнем порядке
  const ordered = useMemo(() => {
    if (!category) return CATEGORIES;
    const here = CATEGORIES.find((c) => c.slug === category.slug);
    return here ? [here, ...CATEGORIES.filter((c) => c.slug !== category.slug)] : CATEGORIES;
  }, [category]);

  // Ушли на другую страницу — панель закрывается
  useEffect(() => setHovered(null), [pathname, search]);

  useEffect(() => {
    if (!hovered) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setHovered(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hovered]);

  const shown = hovered ? CATEGORIES.find((c) => c.slug === hovered) ?? null : null;

  return (
    <div
      ref={wrap}
      // Панель висит рядом со строкой, поэтому закрываем её по уходу со всего
      // блока, а не со строки: иначе она гасла по дороге к подразделам.
      onMouseLeave={() => setHovered(null)}
      className="relative rounded-[8px] border border-inv-border bg-white"
    >
      <h2 className="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted border-b border-inv-border rounded-t-[8px]">
        Разделы
      </h2>

      <nav className="p-2">
        <Link
          to={paths.catalog}
          onMouseEnter={() => setHovered(null)}
          className={`flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms] ${
            category ? 'text-inv-ink hover:text-inv-blue' : 'bg-inv-surface-1 text-inv-red font-semibold'
          }`}
        >
          <span className="flex-1">Все позиции</span>
          <span className="text-xs text-inv-ink-muted tabular-nums">{PRODUCTS.length}</span>
        </Link>

        {ordered.map((cat) => {
          const isHere = cat.slug === category?.slug;
          const isOpen = cat.slug === hovered;

          return (
            <Link
              key={cat.id}
              to={paths.category(cat.slug)}
              onMouseEnter={() => setHovered(cat.slug)}
              onFocus={() => setHovered(cat.slug)}
              aria-current={isHere}
              className={`mt-0.5 flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue ${
                isOpen ? 'bg-inv-surface-1' : ''
              } ${isHere ? 'text-inv-red font-semibold' : 'text-inv-ink hover:text-inv-blue'}`}
            >
              <span className="flex-1 leading-snug">{cat.name}</span>
              <span className="text-xs text-inv-ink-muted tabular-nums">
                {COUNT_CATEGORY.get(cat.slug) ?? 0}
              </span>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-colors duration-[120ms] ${
                  isOpen ? 'text-inv-blue' : 'text-inv-ink-muted/60'
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Подразделы раздела, на который навели: панель поверх выдачи */}
      {shown && (
        <div className="absolute left-full top-0 z-40 pl-2 w-[min(720px,calc(100vw-22rem))]">
          <div className="rounded-[8px] border border-inv-border bg-white shadow-[0_6px_24px_rgba(22,44,88,0.16)] p-5 max-h-[70vh] overflow-y-auto">
            <Link
              to={paths.category(shown.slug)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms]"
            >
              {shown.name}
              <ChevronRight className="w-4 h-4" />
            </Link>

            <ul className="mt-3 columns-2 gap-6">
              {shown.subcategories.map((sub) => {
                const chosen = sub.slug === activeSub && shown.slug === category?.slug;

                return (
                  <li key={sub.id} className="break-inside-avoid">
                    <Link
                      to={`${paths.category(shown.slug)}?sub=${sub.slug}`}
                      onClick={(e) => {
                        // Свой раздел — это отбор, а не переход: бренд и поиск остаются
                        if (shown.slug === category?.slug) {
                          e.preventDefault();
                          onSub(chosen ? null : sub.slug);
                          setHovered(null);
                        }
                      }}
                      className={`flex items-center gap-2.5 min-h-10 py-1 pr-2 text-[13px] leading-snug transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
                        chosen ? 'text-inv-red font-semibold' : 'text-inv-ink hover:text-inv-blue'
                      }`}
                    >
                      <SectionIcon
                        slug={sub.slug}
                        size={18}
                        className={`w-[18px] h-[18px] shrink-0 ${
                          chosen ? 'text-inv-red' : 'text-inv-blue'
                        }`}
                      />
                      <span className="flex-1">{sub.name}</span>
                      <span className="text-[11px] tabular-nums text-inv-ink-muted">
                        {COUNT_SUB.get(sub.slug) ?? 0}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
