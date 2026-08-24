import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { Product } from '../types';
import { productImage } from '../lib/productImages';
import { Reveal } from './Reveal';
import { paths } from '../routes';

/*
 * Карточка товара обычного магазинного вида (референс прислал клиент):
 * фото, раздел мелким капсом, заголовок, короткое описание, действие.
 *
 * Раньше в карточке была ещё таблица из двух характеристик — она делала
 * карточки разной высоты и повторяла то, что и так есть на странице товара.
 */

interface ProductCardProps {
  product: Product;
  isAdded: boolean;
  onQuickView: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdded,
  onAddToQuote
}) => (
  <div className="h-full flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden group transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
    <Link
      to={paths.product(product)}
      className="relative block h-48 bg-white p-4 border-b border-inv-border-subtle focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue"
    >
      <img
        src={productImage(product)}
        alt={product.title}
        loading="lazy"
        className="w-full h-full object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
      />

      {product.badge && (
        <span className="absolute top-3 left-3 rounded-[4px] bg-inv-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em] text-white">
          {product.badge}
        </span>
      )}
    </Link>

    <div className="flex flex-1 flex-col p-4 sm:p-5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-inv-blue line-clamp-1">
        {product.subcategoryName}
      </span>

      <Link
        to={paths.product(product)}
        className="mt-2 block text-[15px] font-semibold text-inv-ink leading-snug line-clamp-2 hover:text-inv-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
      >
        {product.title}
      </Link>

      {product.description && (
        <p className="mt-2 text-sm leading-relaxed text-inv-ink-muted line-clamp-3">
          {product.description}
        </p>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between gap-3">
        <Link
          to={paths.product(product)}
          className="inline-flex items-center gap-1.5 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Подробнее
          <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5" />
        </Link>

        <button
          type="button"
          onClick={() => onAddToQuote(product)}
          aria-label={isAdded ? 'Уже в смете' : 'Добавить в смету'}
          className={`inline-flex items-center gap-1.5 min-h-11 px-3 rounded-[4px] text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
            isAdded
              ? 'bg-inv-surface-2 text-inv-ink'
              : 'bg-inv-surface-1 text-inv-ink hover:bg-inv-surface-2'
          }`}
        >
          {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">{isAdded ? 'В смете' : 'В смету'}</span>
        </button>
      </div>
    </div>
  </div>
);

interface ProductGridProps {
  products: Product[];
  quoteItemsIds: string[];
  onQuickView: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
  /** Сколько карточек в ряду на широком экране. */
  columns?: 3 | 4;
}

// Классы перечислены целиком: Tailwind не собирает имена по частям.
const GRID_COLUMNS: Record<3 | 4, string> = {
  3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch'
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  quoteItemsIds,
  onQuickView,
  onAddToQuote,
  columns = 4
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-inv-ink-muted bg-inv-surface-1 rounded-[8px] border border-inv-border">
        В этом разделе пока нет позиций. Напишите нам, подберём аналог под ваш проект.
      </div>
    );
  }

  return (
    <div className={GRID_COLUMNS[columns]}>
      {products.map((product, idx) => (
        <Reveal key={product.id} delay={Math.min(idx * 0.04, 0.24)} className="h-full">
          <ProductCard
            product={product}
            isAdded={quoteItemsIds.includes(product.id)}
            onQuickView={onQuickView}
            onAddToQuote={onAddToQuote}
          />
        </Reveal>
      ))}
    </div>
  );
};
