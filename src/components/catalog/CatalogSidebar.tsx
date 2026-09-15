import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X } from 'lucide-react';
import { Category, SubCategory } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { SectionIcon } from '../../lib/sectionIcons';
import {
  CatalogFilters,
  CatalogResult,
  Flag,
  FLAG_LABEL,
  isFiltered
} from '../../lib/catalogFilters';
import { plural } from '../../lib/plural';
import { FacetGroup } from './FacetGroup';
import { paths } from '../../routes';

/*
 * Левая колонка каталога: дерево разделов и отбор по признакам.
 *
 * Счётчики разделов раньше считались фильтром по всем 5124 позициям на каждую
 * строку и при каждой перерисовке. Теперь это две карты, собранные один раз
 * при загрузке модуля.
 */

const COUNT_CATEGORY = new Map<string, number>();
const COUNT_SUB = new Map<string, number>();
for (const product of PRODUCTS) {
  COUNT_CATEGORY.set(product.categorySlug, (COUNT_CATEGORY.get(product.categorySlug) ?? 0) + 1);
  COUNT_SUB.set(product.subcategorySlug, (COUNT_SUB.get(product.subcategorySlug) ?? 0) + 1);
}

/*
 * Подразделы выбранного раздела. В крепеже их тридцать, и если вывести все,
 * отбор по бренду уезжает на экран вниз. Показываем восемь, остальные — по
 * нажатию; выбранный подраздел виден всегда.
 */
const PREVIEW_SUBS = 8;

const SubList: React.FC<{
  subcategories: SubCategory[];
  active: string | null;
  onSub: (slug: string | null) => void;
}> = ({ subcategories, active, onSub }) => {
  const [all, setAll] = useState(false);

  const visible =
    all || subcategories.length <= PREVIEW_SUBS + 2
      ? subcategories
      : [
          ...subcategories.slice(0, PREVIEW_SUBS),
          ...subcategories.slice(PREVIEW_SUBS).filter((sub) => sub.slug === active)
        ];
  const hidden = subcategories.length - visible.length;

  return (
    <>
      <ul className="mt-1 ml-3 border-l border-inv-border">
        {visible.map((sub) => (
          <li key={sub.id}>
            <button
              type="button"
              onClick={() => onSub(active === sub.slug ? null : sub.slug)}
              aria-pressed={active === sub.slug}
              className={`w-full flex items-center gap-2.5 min-h-11 pl-2 pr-2.5 text-left text-sm cursor-pointer transition-colors duration-[120ms] ${
                active === sub.slug
                  ? 'text-inv-red font-semibold'
                  : 'text-inv-ink-muted hover:text-inv-blue'
              }`}
            >
              <SectionIcon
                slug={sub.slug}
                size={18}
                className={`w-[18px] h-[18px] shrink-0 ${
                  active === sub.slug ? 'text-inv-red' : 'text-inv-blue'
                }`}
              />
              <span className="flex-1 leading-snug">{sub.name}</span>
              <span className="text-xs tabular-nums">{COUNT_SUB.get(sub.slug) ?? 0}</span>
            </button>
          </li>
        ))}
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setAll(true)}
          className="ml-5 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]"
        >
          Ещё {hidden} {plural(hidden, ['подраздел', 'подраздела', 'подразделов'])}
        </button>
      )}
      {all && subcategories.length > PREVIEW_SUBS + 2 && (
        <button
          type="button"
          onClick={() => setAll(false)}
          className="ml-5 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]"
        >
          Свернуть подразделы
        </button>
      )}
    </>
  );
};

export interface SidebarProps {
  category: Category | null;
  filters: CatalogFilters;
  result: CatalogResult;
  onSub: (slug: string | null) => void;
  onBrand: (value: string) => void;
  onCountry: (value: string) => void;
  onFlag: (flag: Flag) => void;
  onReset: () => void;
  /** Закрыть выдвижную панель на телефоне: в боковой колонке не нужен. */
  onNavigate?: () => void;
}

export const CatalogSidebar: React.FC<SidebarProps> = ({
  category,
  filters,
  result,
  onSub,
  onBrand,
  onCountry,
  onFlag,
  onReset,
  onNavigate
}) => (
  <div className="rounded-[8px] border border-inv-border bg-white overflow-hidden">
    <h2 className="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted border-b border-inv-border">
      Разделы
    </h2>

    <nav className="p-2">
      <Link
        to={paths.catalog}
        onClick={onNavigate}
        className={`flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms] ${
          !category ? 'bg-inv-surface-1 text-inv-red font-semibold' : 'text-inv-ink hover:text-inv-blue'
        }`}
      >
        <SectionIcon slug="all" size={20} className="w-5 h-5 shrink-0 text-inv-blue" />
        <span className="flex-1">Все позиции</span>
        <span className="text-xs text-inv-ink-muted tabular-nums">{PRODUCTS.length}</span>
      </Link>

      {CATEGORIES.map((cat) => {
        const isOpen = category?.slug === cat.slug;

        return (
          <div key={cat.id} className="mt-1">
            <Link
              to={paths.category(cat.slug)}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms] ${
                isOpen
                  ? 'bg-inv-surface-1 text-inv-red font-semibold'
                  : 'text-inv-ink hover:text-inv-blue'
              }`}
            >
              <SectionIcon
                slug={cat.slug}
                size={20}
                className={`w-5 h-5 shrink-0 ${isOpen ? 'text-inv-red' : 'text-inv-blue'}`}
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-inv-ink-muted tabular-nums">
                {COUNT_CATEGORY.get(cat.slug) ?? 0}
              </span>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-transform duration-[240ms] ${
                  isOpen ? 'rotate-90' : ''
                }`}
              />
            </Link>

            {/* Подразделы раскрываются только у выбранного раздела */}
            {isOpen && (
              <SubList
                subcategories={cat.subcategories}
                active={filters.sub}
                onSub={onSub}
              />
            )}
          </div>
        );
      })}
    </nav>

    <div className="border-t border-inv-border px-4 py-3">
      <span className="flex items-center min-h-11 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">
        Показывать
      </span>
      <ul>
        {(Object.keys(FLAG_LABEL) as Flag[]).map((flag) => {
          const on = filters.flags.includes(flag);
          const count = result.flags[flag];
          return (
            <li key={flag}>
              <button
                type="button"
                onClick={() => onFlag(flag)}
                aria-pressed={on}
                disabled={!count && !on}
                className={`w-full flex items-center gap-2.5 min-h-9 py-1 text-left rounded-[4px] transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
                  !count && !on ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer group'
                }`}
              >
                <span
                  className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-[120ms] ${
                    on
                      ? 'bg-inv-blue border-inv-blue text-white'
                      : 'border-inv-border bg-white group-hover:border-inv-blue'
                  }`}
                >
                  {on && <span className="block w-2 h-2 rounded-[1px] bg-white" />}
                </span>
                <span
                  className={`flex-1 text-[13px] leading-snug ${
                    on ? 'text-inv-ink font-semibold' : 'text-inv-ink group-hover:text-inv-blue'
                  }`}
                >
                  {FLAG_LABEL[flag]}
                </span>
                <span className="text-[11px] tabular-nums text-inv-ink-muted">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>

    <FacetGroup
      title="Бренд"
      options={result.brands}
      selected={filters.brands}
      onToggle={onBrand}
    />
    <FacetGroup
      title="Страна"
      options={result.countries}
      selected={filters.countries}
      onToggle={onCountry}
      preview={6}
    />

    {isFiltered(filters) && (
      <div className="border-t border-inv-border p-4">
        <button
          type="button"
          onClick={onReset}
          className="w-full inline-flex items-center justify-center gap-1.5 min-h-11 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-red hover:text-inv-red"
        >
          <X className="w-4 h-4" />
          Сбросить отбор
        </button>
      </div>
    )}
  </div>
);
