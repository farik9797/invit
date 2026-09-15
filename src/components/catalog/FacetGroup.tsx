import React, { useMemo, useState } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

/*
 * Список значений одного признака (бренд, страна) с флажками и счётчиками.
 *
 * Брендов в каталоге шестьдесят, поэтому по умолчанию показываем восемь самых
 * частых, а длинные списки получают собственное поле поиска: искать «Макиту»
 * прокруткой на телефоне — занятие на полминуты.
 */

interface FacetGroupProps {
  title: string;
  options: [string, number][];
  selected: string[];
  onToggle: (value: string) => void;
  /** Сколько строк видно до нажатия «Показать все». */
  preview?: number;
}

export const FacetGroup: React.FC<FacetGroupProps> = ({
  title,
  options,
  selected,
  onToggle,
  preview = 8
}) => {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [needle, setNeedle] = useState('');

  const found = useMemo(() => {
    const q = needle.trim().toLowerCase();
    if (!q) return options;
    return options.filter(([value]) => value.toLowerCase().includes(q));
  }, [options, needle]);

  // Выбранное не должно уезжать под кат: иначе снять флажок можно только
  // раскрыв список целиком.
  const visible = useMemo(() => {
    if (expanded || needle.trim()) return found;
    const head = found.slice(0, preview);
    const tail = found.slice(preview).filter(([value]) => selected.includes(value));
    return [...head, ...tail];
  }, [found, expanded, needle, preview, selected]);

  if (!options.length) return null;

  const hidden = found.length - visible.length;

  return (
    <div className="border-t border-inv-border px-4 py-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-2 min-h-11 text-left cursor-pointer group"
      >
        <span className="flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted group-hover:text-inv-ink transition-colors duration-[120ms]">
          {title}
        </span>
        {selected.length > 0 && (
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-inv-blue text-white text-[11px] font-semibold tabular-nums">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-inv-ink-muted transition-transform duration-[240ms] ${
            open ? '' : '-rotate-90'
          }`}
        />
      </button>

      {open && (
        <div className="mt-1">
          {options.length > 12 && (
            <span className="relative block mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-inv-ink-muted" />
              <input
                value={needle}
                onChange={(e) => setNeedle(e.target.value)}
                placeholder={`Найти в «${title.toLowerCase()}»`}
                aria-label={`Поиск: ${title}`}
                className="w-full h-9 pl-8 pr-2 rounded-[4px] border border-inv-border bg-white text-[13px] text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
              />
            </span>
          )}

          <ul>
            {visible.map(([value, count]) => {
              const on = selected.includes(value);
              return (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => onToggle(value)}
                    aria-pressed={on}
                    className="w-full flex items-center gap-2.5 min-h-9 py-1 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue rounded-[4px]"
                  >
                    <span
                      className={`w-[18px] h-[18px] shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-[120ms] ${
                        on
                          ? 'bg-inv-blue border-inv-blue text-white'
                          : 'border-inv-border bg-white group-hover:border-inv-blue'
                      }`}
                    >
                      {on && <Check className="w-3 h-3" strokeWidth={3} />}
                    </span>
                    <span
                      className={`flex-1 text-[13px] leading-snug ${
                        on ? 'text-inv-ink font-semibold' : 'text-inv-ink group-hover:text-inv-blue'
                      }`}
                    >
                      {value}
                    </span>
                    <span className="text-[11px] tabular-nums text-inv-ink-muted">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {!found.length && (
            <p className="py-2 text-[13px] text-inv-ink-muted">Ничего не нашлось</p>
          )}

          {hidden > 0 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-1 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]"
            >
              Показать все ({found.length})
            </button>
          )}
          {expanded && !needle.trim() && found.length > preview && (
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="mt-1 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]"
            >
              Свернуть
            </button>
          )}
        </div>
      )}
    </div>
  );
};
