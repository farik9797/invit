import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CatalogFilters, CatalogResult, toggle } from '../../lib/catalogFilters';
import { SIZE_LABEL, SizeAxis } from '../../lib/productSize';
import { formatPrice } from '../../lib/price';
import { FacetList } from './FacetList';

/*
 * Строка фильтров над выдачей (образец — karchercenter.kz): признаки стоят
 * в ряд выпадающими кнопками, а не столбиком в боковой колонке.
 *
 * Так фильтр оказывается рядом с сортировкой и видом выдачи — всё управление
 * списком в одном месте, а колонка слева остаётся под разделы и поиск.
 */

interface FilterBarProps {
  filters: CatalogFilters;
  result: CatalogResult;
  onChange: (patch: Partial<CatalogFilters>) => void;
}

/** Кнопка со списком значений: раскрывается окошком под собой. */
const Facet: React.FC<{
  title: string;
  options: [string, number][];
  selected: string[];
  onToggle: (value: string) => void;
  preview?: number;
}> = ({ title, options, selected, onToggle, preview = 8 }) => {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!options.length) return null;

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center gap-2 min-h-11 px-3.5 rounded-[10px] border bg-white text-sm cursor-pointer transition-colors duration-[120ms] ${
          selected.length || open
            ? 'border-inv-blue text-inv-ink'
            : 'border-inv-border text-inv-ink hover:border-inv-blue'
        }`}
      >
        <span className="flex-1 text-left truncate">{title}</span>
        {selected.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-inv-ink-muted transition-transform duration-[240ms] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-[min(320px,calc(100vw-2rem))] max-h-[60vh] overflow-y-auto rounded-[10px] border border-inv-border bg-white p-3 shadow-[0_16px_40px_rgba(10,25,60,0.18)]">
          <FacetList
            title={title}
            options={options}
            selected={selected}
            onToggle={onToggle}
            preview={preview}
          />
        </div>
      )}
    </div>
  );
};

const text = (value: number | null) => (value === null ? '' : String(value));

const parse = (raw: string): number | null => {
  const value = Number(raw.replace(',', '.').trim());
  return raw.trim() && Number.isFinite(value) && value >= 0 ? value : null;
};

export const FilterBar: React.FC<FilterBarProps> = ({ filters, result, onChange }) => {
  const [from, setFrom] = useState(text(filters.price.min));
  const [to, setTo] = useState(text(filters.price.max));

  useEffect(() => {
    setFrom(text(filters.price.min));
    setTo(text(filters.price.max));
  }, [filters.price.min, filters.price.max]);

  // Применяем по Enter и по уходу из поля: на каждую цифру перестраивать
  // выдачу из пяти тысяч позиций незачем.
  const applyPrice = () => {
    const next = { min: parse(from), max: parse(to) };
    if (next.min !== null && next.max !== null && next.min > next.max) {
      onChange({ price: { min: next.max, max: next.min } });
      return;
    }
    if (next.min !== filters.price.min || next.max !== filters.price.max) {
      onChange({ price: next });
    }
  };

  const money = (value: number) => formatPrice(value).replace(' р.', '');
  const field =
    'w-full min-h-11 px-3 rounded-[10px] border border-inv-border bg-white text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';

  return (
    <div className="mt-3 rounded-[10px] border border-inv-border bg-inv-surface-1 p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-3">
        {/* Цена двумя полями: разброс от 17 копеек до 2390 рублей, ползунок
            на таком отрезке в первой трети бесполезен. */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-inv-ink-muted shrink-0">Цена</span>
          <input
            inputMode="decimal"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
            placeholder={result.priceRange ? money(result.priceRange.min) : 'от'}
            aria-label="Цена от"
            className={field}
          />
          <span aria-hidden className="text-inv-ink-muted">
            —
          </span>
          <input
            inputMode="decimal"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={applyPrice}
            onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
            placeholder={result.priceRange ? money(result.priceRange.max) : 'до'}
            aria-label="Цена до"
            className={field}
          />
        </div>

        <Facet
          title="Бренд"
          options={result.brands}
          selected={filters.brands}
          onToggle={(value) => onChange({ brands: toggle(filters.brands, value) })}
        />
        <Facet
          title="Страна"
          options={result.countries}
          selected={filters.countries}
          onToggle={(value) => onChange({ countries: toggle(filters.countries, value) })}
          preview={6}
        />

        {/* Размеры есть не у каждого раздела: в крепеже диаметр и длина,
            в оснастке только диаметр. */}
        {result.sizes.map(({ axis, options }) => (
          <Facet
            key={axis}
            title={SIZE_LABEL[axis]}
            options={options}
            selected={filters.sizes[axis]}
            onToggle={(value) =>
              onChange({ sizes: { ...filters.sizes, [axis]: toggle(filters.sizes[axis], value) } })
            }
            preview={10}
          />
        ))}
      </div>
    </div>
  );
};

export type { SizeAxis };
