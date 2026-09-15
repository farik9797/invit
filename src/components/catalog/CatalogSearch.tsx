import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '../../data/catalogData';
import { productImage } from '../../lib/productImages';
import { searchProducts } from '../../lib/search';
import { SectionIcon } from '../../lib/sectionIcons';
import { plural } from '../../lib/plural';
import { paths } from '../../routes';

/*
 * Поиск по каталогу с подсказкой — такой же, как в шапке сайта: товары
 * показываются прямо под полем, не дожидаясь отправки формы.
 *
 * Ищем по всему каталогу, а не по открытому разделу: человек, который набирает
 * «псул», ждёт ленту, даже если стоит в крепеже. А Enter применяет запрос к
 * текущей странице — раздел и выбранные бренды при этом сохраняются.
 */

const PREVIEW = 6;

interface CatalogSearchProps {
  /** Запрос, уже применённый к выдаче: с ним поле открывается. */
  query: string;
  onSubmit: (query: string) => void;
  /** Кнопка «Найти» рядом с полем — на телефоне, где колонки нет. */
  withButton?: boolean;
  className?: string;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({
  query,
  onSubmit,
  withButton = false,
  className = ''
}) => {
  const [draft, setDraft] = useState(query);
  const [focused, setFocused] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => setDraft(query), [query]);

  const matches = useMemo(() => (draft.trim() ? searchProducts(PRODUCTS, draft) : []), [draft]);
  const open = focused && draft.trim().length > 0;

  // Щелчок мимо закрывает подсказку, но запрос в поле остаётся
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const apply = (value: string) => {
    onSubmit(value.trim());
    setFocused(false);
  };

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          apply(draft);
        }}
        className="flex gap-2"
      >
        <span className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-inv-ink-muted" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => e.key === 'Escape' && setFocused(false)}
            placeholder="Поиск: лента, ПСУЛ, артикул…"
            aria-label="Поиск по каталогу"
            className="w-full min-h-11 pl-9 pr-9 rounded-[10px] border border-inv-border bg-white text-sm text-inv-ink placeholder:text-inv-ink-muted transition-colors duration-[120ms] hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
          />
          {draft && (
            <button
              type="button"
              onClick={() => {
                setDraft('');
                apply('');
              }}
              aria-label="Очистить поиск"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-inv-ink-muted hover:text-inv-ink cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </span>

        {withButton && (
          <button
            type="submit"
            className="min-h-11 px-5 rounded-[10px] bg-inv-blue text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] hover:bg-inv-blue-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
          >
            Найти
          </button>
        )}
      </form>

      {/* В колонке поле узкое, а названия длинные: подсказку расширяем вправо,
          поверх выдачи. На телефоне она и так во всю ширину. */}
      {open && (
        <div className="absolute left-0 right-0 lg:min-w-[380px] top-[calc(100%+6px)] z-40 rounded-[8px] border border-inv-border bg-white shadow-[0_16px_40px_rgba(10,25,60,0.18)] overflow-hidden">
          {matches.length === 0 ? (
            <p className="px-4 py-4 text-sm text-inv-ink-muted">
              Ничего не нашлось. Попробуйте короче или введите артикул.
            </p>
          ) : (
            <>
              <ul className="max-h-[52vh] overflow-y-auto">
                {matches.slice(0, PREVIEW).map((product) => (
                  <li key={product.id}>
                    <Link
                      to={paths.product(product)}
                      onClick={() => setFocused(false)}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-inv-surface-1 transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue"
                    >
                      <span className="w-10 h-10 shrink-0 flex items-center justify-center rounded-[4px] border border-inv-border-subtle bg-white p-1">
                        {productImage(product) ? (
                          <img
                            src={productImage(product)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <SectionIcon
                            slug={product.subcategorySlug}
                            size={22}
                            className="w-[22px] h-[22px] text-inv-border"
                          />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] text-inv-ink leading-snug line-clamp-2">
                          {product.title}
                        </span>
                        {product.sku && (
                          <span className="mt-0.5 block text-xs text-inv-ink-muted">
                            Артикул {product.sku}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => apply(draft)}
                className="w-full flex items-center justify-center min-h-11 border-t border-inv-border-subtle text-sm font-semibold text-inv-blue cursor-pointer hover:bg-inv-surface-1 transition-colors duration-[120ms]"
              >
                Показать все {matches.length} {plural(matches.length, ['позицию', 'позиции', 'позиций'])}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
