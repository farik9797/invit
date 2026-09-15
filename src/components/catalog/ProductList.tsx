import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { Product } from '../../types';
import { productImage } from '../../lib/productImages';
import { SectionIcon } from '../../lib/sectionIcons';
import { specValue } from '../../lib/catalogFilters';
import { paths } from '../../routes';

/*
 * Список вместо плитки: строка на позицию.
 *
 * Плитка хороша, когда выбирают глазами по снимку, но в разделах вроде оснастки
 * (3388 позиций, у половины снимка нет) сравнивают названия и артикулы. В строке
 * на экран помещается втрое больше позиций, а название видно целиком.
 */

interface RowProps {
  product: Product;
  isAdded: boolean;
  onAddToQuote: (product: Product) => void;
}

const Row: React.FC<RowProps> = ({ product, isAdded, onAddToQuote }) => {
  const brand = specValue(product, 'Бренд');
  const sku = specValue(product, 'Артикул');

  return (
    <li className="group flex gap-3 sm:gap-5 p-3 sm:p-4 bg-white transition-colors duration-[120ms] hover:bg-inv-surface-1">
      <Link
        to={paths.product(product)}
        className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-[4px] border border-inv-border-subtle bg-white p-1.5 sm:p-2 overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
      >
        {productImage(product) ? (
          <img
            src={productImage(product)}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center text-inv-border">
            <SectionIcon slug={product.subcategorySlug} size={40} className="w-9 h-9" />
          </span>
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <span className="flex items-center gap-2 text-inv-blue">
          <SectionIcon slug={product.subcategorySlug} size={14} className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] line-clamp-1">
            {product.subcategoryName}
          </span>
        </span>

        <Link
          to={paths.product(product)}
          className="mt-1 block text-[15px] font-semibold text-inv-ink leading-snug line-clamp-3 sm:line-clamp-none hover:text-inv-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          {product.title}
        </Link>

        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-inv-ink-muted">
          {brand && (
            <span>
              Бренд: <span className="text-inv-ink">{brand}</span>
            </span>
          )}
          {sku && (
            <span className="tabular-nums">
              Артикул: <span className="text-inv-ink">{sku}</span>
            </span>
          )}
          {product.variants?.length ? (
            <span>
              {product.variantLabel?.toLowerCase() ?? 'исполнений'}:{' '}
              <span className="text-inv-ink">{product.variants.length} шт.</span>
            </span>
          ) : null}
          {product.badge === 'Собственное производство' && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-inv-red/10 text-inv-red font-semibold">
              Наше производство
            </span>
          )}
        </span>

        {product.description && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-inv-ink-muted line-clamp-2 sm:line-clamp-1">
            {product.description}
          </p>
        )}

        {/* На узком экране действия уходят под текст: справа для них нет места */}
        <span className="mt-2 flex sm:hidden items-center gap-3">
          <Link
            to={paths.product(product)}
            className="inline-flex items-center gap-1.5 min-h-11 text-[13px] font-semibold text-inv-blue"
          >
            Подробнее
            <ArrowRight className="w-4 h-4" />
          </Link>
          {!product.variants?.length && (
            <button
              type="button"
              onClick={() => onAddToQuote(product)}
              className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-[4px] text-[13px] font-semibold bg-inv-surface-1 text-inv-ink cursor-pointer active:scale-[0.98] transition-transform duration-[120ms]"
            >
              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAdded ? 'В корзине' : 'В корзину'}
            </button>
          )}
        </span>
      </div>

      <div className="hidden sm:flex shrink-0 flex-col items-end justify-center gap-2">
        {product.variants?.length ? (
          <Link
            to={paths.product(product)}
            className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-[4px] bg-inv-surface-1 text-sm font-semibold text-inv-ink whitespace-nowrap hover:bg-inv-surface-2 transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
          >
            <Plus className="w-4 h-4" />
            Выбрать размер
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onAddToQuote(product)}
            aria-label={isAdded ? 'Уже в корзине' : 'Добавить в корзину'}
            className={`inline-flex items-center gap-1.5 min-h-11 px-4 rounded-[4px] text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
              isAdded ? 'bg-inv-surface-2 text-inv-ink' : 'bg-inv-surface-1 text-inv-ink hover:bg-inv-surface-2'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdded ? 'В корзине' : 'В корзину'}
          </button>
        )}

        <Link
          to={paths.product(product)}
          className="inline-flex items-center gap-1.5 min-h-9 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Подробнее
          <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-0.5" />
        </Link>
      </div>
    </li>
  );
};

interface ProductListProps {
  products: Product[];
  quoteItemsIds: string[];
  onAddToQuote: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  quoteItemsIds,
  onAddToQuote
}) => (
  <ul className="rounded-[8px] border border-inv-border overflow-hidden divide-y divide-inv-border-subtle">
    {products.map((product) => (
      <Row
        key={product.id}
        product={product}
        isAdded={quoteItemsIds.includes(product.id)}
        onAddToQuote={onAddToQuote}
      />
    ))}
  </ul>
);
