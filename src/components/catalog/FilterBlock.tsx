import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/*
 * Свёрнутый блок отбора: строка заголовка со счётчиком выбранного, содержимое
 * раскрывается по щелчку.
 *
 * Открытыми блоки занимали в боковой колонке больше места, чем всё дерево
 * разделов, и до «Страны» приходилось прокручивать. Свёрнутые — это три строки,
 * а отбор виден по счётчикам, не раскрывая.
 */

interface FilterBlockProps {
  title: string;
  /** Сколько значений выбрано — показывается в заголовке и когда блок свёрнут. */
  count?: number;
  /** Блок с выбранным значением открыт сразу: иначе снять его вслепую нельзя. */
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const FilterBlock: React.FC<FilterBlockProps> = ({
  title,
  count = 0,
  defaultOpen = false,
  children
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-inv-border px-4 py-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 min-h-11 text-left cursor-pointer group"
      >
        <span className="flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]">
          {title}
        </span>
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
            {count}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-inv-ink-muted transition-transform duration-[240ms] ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>

      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};
