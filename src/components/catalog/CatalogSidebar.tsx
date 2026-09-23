import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { Category, SubCategory } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { COUNT_CATEGORY, COUNT_SUB } from '../../lib/catalogCounts';
import { SectionMark } from '../../lib/sectionPhotos';
import { PRICES_SHOWN } from '../../lib/price';
import { CatalogFilters, CatalogResult, isFiltered } from '../../lib/catalogFilters';
import { SIZE_LABEL, SizeAxis } from '../../lib/productSize';
import { plural } from '../../lib/plural';
import { FacetGroup } from './FacetGroup';
import { PriceFilter } from './PriceFilter';
import { SectionsMenu } from './SectionsMenu';
import { paths } from '../../routes';

/*
 * Левая колонка каталога: разделы и отбор по признакам.
 *
 * На широком экране разделы — мега-меню: закрытое это одна строка, открытое
 * перекрывает выдачу и показывает все подразделы в два-три столбца. В
 * выдвижной панели на телефоне перекрывать нечем, поэтому там остаётся дерево.
 */

/*
 * Подразделы выбранного раздела. В крепеже их двадцать два, и если вывести все,
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
        {visible.map((sub, idx) => (
          <li key={sub.id}>
            {/* Заголовок группы: показываем, когда она сменилась */}
            {sub.group && sub.group !== visible[idx - 1]?.group && (
              <span className="mt-2 mb-0.5 block pl-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-inv-ink-muted">
                {sub.group}
              </span>
            )}
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
              <SectionMark
                slug={sub.slug}
                size={24}
                className={`w-6 h-6 shrink-0 ${
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

/** Дерево разделов для выдвижной панели на телефоне. */
const SectionsTree: React.FC<{
  category: Category | null;
  activeSub: string | null;
  onSub: (slug: string | null) => void;
  onNavigate?: () => void;
}> = ({ category, activeSub, onSub, onNavigate }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-[8px] border border-inv-border bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-2 bg-inv-surface-1 px-4 py-3 cursor-pointer group ${
          open ? 'border-b border-inv-border' : ''
        }`}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]">
          Разделы
        </span>
        {/* Свёрнутое дерево всё равно должно отвечать, где мы находимся */}
        <span className="flex-1 min-w-0 text-left text-[11px] text-inv-ink-muted truncate">
          {!open && (category ? category.name : 'Все позиции')}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-inv-ink-muted transition-transform duration-[240ms] ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>

      {open && (
        <nav className="p-2">
          <Link
            to={paths.catalog}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms] ${
              !category
                ? 'bg-inv-surface-1 text-inv-red font-semibold'
                : 'text-inv-ink hover:text-inv-blue'
            }`}
          >
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
                  <SubList subcategories={cat.subcategories} active={activeSub} onSub={onSub} />
                )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export interface SidebarProps {
  category: Category | null;
  filters: CatalogFilters;
  result: CatalogResult;
  onSub: (slug: string | null) => void;
  onBrand: (value: string) => void;
  onCountry: (value: string) => void;
  onSize: (axis: SizeAxis, value: string) => void;
  onPrice: (value: { min: number | null; max: number | null }) => void;
  onReset: () => void;
  /** Закрыть выдвижную панель на телефоне: в боковой колонке не нужен. */
  onNavigate?: () => void;
  /** В выдвижной панели разделы показываем деревом, а не мега-меню. */
  variant?: 'aside' | 'drawer';
  /** Поиск по каталогу — под разделами, как просил клиент. */
  search?: React.ReactNode;
}

export const CatalogSidebar: React.FC<SidebarProps> = ({
  category,
  filters,
  result,
  onSub,
  onBrand,
  onCountry,
  onSize,
  onPrice,
  onReset,
  onNavigate,
  variant = 'aside',
  search
}) => (
  <div className="space-y-4">
    {variant === 'aside' ? (
      <SectionsMenu
        category={category}
        activeSub={filters.sub}
        onSub={onSub}
        search={search}
      />
    ) : (
      <SectionsTree
        category={category}
        activeSub={filters.sub}
        onSub={onSub}
        onNavigate={onNavigate}
      />
    )}

    {/* Признаки на широком экране живут строкой над выдачей (FilterBar) —
        в колонке они остаются только в выдвижной панели на телефоне. */}
    {variant === 'drawer' && (
      <div className="rounded-[8px] border border-inv-border bg-white overflow-hidden">
        <h2 className="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">
          Фильтр
        </h2>

        {PRICES_SHOWN && (
          <PriceFilter value={filters.price} range={result.priceRange} onChange={onPrice} />
        )}

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

        {result.sizes.map(({ axis, options }) => (
          <FacetGroup
            key={axis}
            title={SIZE_LABEL[axis]}
            options={options}
            selected={filters.sizes[axis]}
            onToggle={(value) => onSize(axis, value)}
            preview={10}
          />
        ))}

        {isFiltered(filters) && (
          <div className="border-t border-inv-border p-4">
            <button
              type="button"
              onClick={onReset}
              className="w-full inline-flex items-center justify-center gap-1.5 min-h-11 rounded-[4px] border border-inv-border bg-white text-sm font-semibold text-inv-ink cursor-pointer transition-colors duration-[120ms] hover:border-inv-red hover:text-inv-red"
            >
              <X className="w-4 h-4" />
              Сбросить фильтр
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);
