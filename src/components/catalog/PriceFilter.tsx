import React, { useEffect, useState } from 'react';
import { FilterBlock } from './FilterBlock';
import { formatPrice } from '../../lib/price';

/*
 * Цена «от» и «до» двумя полями, а не ползунком: разброс в каталоге от 17
 * копеек до двух тысяч рублей, и на таком отрезке ползунок в первой трети
 * становится бесполезным — соседние точки отличаются на копейку.
 *
 * Применяем по Enter и по уходу из поля: на каждую набранную цифру
 * перестраивать выдачу из пяти тысяч позиций незачем.
 */

interface PriceFilterProps {
  value: { min: number | null; max: number | null };
  /** Границы выборки — подставляются в поля подсказкой. */
  range: { min: number; max: number } | null;
  onChange: (value: { min: number | null; max: number | null }) => void;
}

const text = (value: number | null) => (value === null ? '' : String(value));

const parse = (raw: string): number | null => {
  const value = Number(raw.replace(',', '.').trim());
  return raw.trim() && Number.isFinite(value) && value >= 0 ? value : null;
};

/** Подсказка пишется так же, как цены в карточках: «0,17», а не «0.17». */
const hint = (value: number) => formatPrice(value).replace(' р.', '');

export const PriceFilter: React.FC<PriceFilterProps> = ({ value, range, onChange }) => {
  const [from, setFrom] = useState(text(value.min));
  const [to, setTo] = useState(text(value.max));

  useEffect(() => {
    setFrom(text(value.min));
    setTo(text(value.max));
  }, [value.min, value.max]);

  const apply = () => {
    const next = { min: parse(from), max: parse(to) };
    // Перепутанные местами границы меняем сами, вместо пустой выдачи
    if (next.min !== null && next.max !== null && next.min > next.max) {
      onChange({ min: next.max, max: next.min });
      return;
    }
    if (next.min !== value.min || next.max !== value.max) onChange(next);
  };

  const field =
    'w-full h-10 px-2.5 rounded-[6px] border border-inv-border bg-white text-[13px] text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';

  return (
    <FilterBlock
      title="Цена"
      count={(value.min !== null ? 1 : 0) + (value.max !== null ? 1 : 0)}
      defaultOpen={value.min !== null || value.max !== null}
    >
      <div className="flex items-center gap-2">
        <label className="flex-1">
          <span className="sr-only">Цена от</span>
          <input
            inputMode="decimal"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onBlur={apply}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={range ? `от ${hint(range.min)}` : 'от'}
            className={field}
          />
        </label>
        <span aria-hidden className="text-inv-ink-muted">
          —
        </span>
        <label className="flex-1">
          <span className="sr-only">Цена до</span>
          <input
            inputMode="decimal"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onBlur={apply}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            placeholder={range ? `до ${hint(range.max)}` : 'до'}
            className={field}
          />
        </label>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-inv-ink-muted">
        Позиции без цены («по запросу») в отбор по цене не попадают.
      </p>
    </FilterBlock>
  );
};
