import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react';
import { Category } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { COUNT_CATEGORY, COUNT_SUB } from '../../lib/catalogCounts';
import { SectionIcon } from '../../lib/sectionIcons';
import { paths } from '../../routes';

/*
 * Разделы каталога в виде мега-меню — как в шапке сайта (референс stmg.by):
 * слева столбец разделов, справа широкая панель подразделов.
 *
 * Деревом в боковой колонке это занимало до двух тысяч точек по высоте: у
 * крепежа двадцать два подраздела, у оснастки — семьдесят. В мега-меню все
 * подразделы раздела видны сразу в два-три столбца, а закрытое меню — одна
 * строка, и отбор по бренду оказывается на первом экране.
 */

interface SectionsMenuProps {
  category: Category | null;
  activeSub: string | null;
  /** Выбор подраздела внутри текущего раздела — без сброса бренда и поиска. */
  onSub: (slug: string | null) => void;
}

export const SectionsMenu: React.FC<SectionsMenuProps> = ({ category, activeSub, onSub }) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(() =>
    Math.max(CATEGORIES.findIndex((c) => c.slug === category?.slug), 0)
  );
  const wrap = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  // Перешли на другую страницу — меню закрывается
  useEffect(() => setOpen(false), [pathname, search]);

  // Открыли меню — показываем подразделы того раздела, где находимся
  useEffect(() => {
    if (open) setPreview(Math.max(CATEGORIES.findIndex((c) => c.slug === category?.slug), 0));
  }, [open, category]);

  const shown = CATEGORIES[preview];

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="catalog-sections"
        className={`w-full flex items-center gap-2.5 min-h-12 px-4 rounded-[8px] border cursor-pointer transition-colors duration-[120ms] group ${
          open
            ? 'border-inv-blue bg-inv-surface-1'
            : 'border-inv-border bg-white hover:border-inv-blue'
        }`}
      >
        <LayoutGrid className="w-4 h-4 shrink-0 text-inv-blue" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]">
          Разделы
        </span>
        <span className="flex-1 min-w-0 text-left text-[13px] text-inv-ink truncate">
          {category ? category.name : 'Все позиции'}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-inv-ink-muted transition-transform duration-[240ms] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id="catalog-sections"
          className="absolute left-0 top-full z-40 pt-2 w-[min(1080px,calc(100vw-3rem))]"
        >
          <div className="flex rounded-[8px] border border-inv-border bg-white shadow-[0_6px_24px_rgba(22,44,88,0.16)] overflow-hidden">
            {/* Разделы. Выбранный красный, как в мега-меню шапки */}
            <ul className="w-[272px] shrink-0 border-r border-inv-border bg-inv-surface-1 py-2 max-h-[70vh] overflow-y-auto">
              <li>
                <Link
                  to={paths.catalog}
                  className={`flex items-center gap-3 min-h-11 px-4 text-sm transition-colors duration-[120ms] ${
                    category ? 'text-inv-ink hover:text-inv-red' : 'bg-white text-inv-red font-semibold'
                  }`}
                >
                  <SectionIcon slug="all" size={20} className="w-5 h-5 shrink-0 text-inv-blue" />
                  <span className="flex-1">Все позиции</span>
                  <span className="text-xs text-inv-ink-muted tabular-nums">{PRODUCTS.length}</span>
                </Link>
              </li>

              {CATEGORIES.map((cat, idx) => {
                const isHere = cat.slug === category?.slug;

                return (
                  <li key={cat.id}>
                    <Link
                      to={paths.category(cat.slug)}
                      onMouseEnter={() => setPreview(idx)}
                      onFocus={() => setPreview(idx)}
                      aria-current={isHere}
                      className={`flex items-center gap-3 min-h-11 px-4 text-sm transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue ${
                        idx === preview ? 'bg-white' : ''
                      } ${isHere ? 'text-inv-red font-semibold' : 'text-inv-ink hover:text-inv-red'}`}
                    >
                      <SectionIcon
                        slug={cat.slug}
                        size={20}
                        className={`w-5 h-5 shrink-0 ${isHere ? 'text-inv-red' : 'text-inv-blue'}`}
                      />
                      <span className="flex-1 leading-snug">{cat.name}</span>
                      <span className="text-xs text-inv-ink-muted tabular-nums">
                        {COUNT_CATEGORY.get(cat.slug) ?? 0}
                      </span>
                      <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Подразделы раздела, на который навели */}
            <div className="flex-1 p-5 max-h-[70vh] overflow-y-auto">
              <Link
                to={paths.category(shown.slug)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms]"
              >
                {shown.name}
                <ChevronRight className="w-4 h-4" />
              </Link>

              <ul className="mt-3 columns-2 xl:columns-3 gap-6">
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
                            setOpen(false);
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
        </div>
      )}
    </div>
  );
};
