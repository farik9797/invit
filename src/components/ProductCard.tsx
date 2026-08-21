import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { Reveal } from './Reveal';
import { paths } from '../routes';

interface ProductCardProps {
  product: Product;
  isAdded: boolean;
  onQuickView: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isAdded,
  onQuickView,
  onAddToQuote
}) => {
  // Два коротких факта: характеристики с сайта, иначе шапка размерного ряда.
  // Длинные лабораторные формулировки в карточку не влезают — обрезаем по запятой.
  const shortLabel = (label: string) => label.split(',')[0].trim().slice(0, 34);
  const highlights = (
    product.specs.length
      ? product.specs.map((s) => ({ label: s.label, value: s.value }))
      : (product.sizes?.headers.slice(1, 3).map((header, idx) => ({
          label: header,
          value: product.sizes!.rows[0]?.[idx + 1] ?? '—'
        })) ?? [])
  )
    .filter((row) => row.value.length < 40)
    .slice(0, 2)
    .map((row) => ({ label: shortLabel(row.label), value: row.value }));

  return (
  <div className="h-full bg-white rounded-xl border border-line hover:border-brand-green hover:-translate-y-1 hover:shadow-lg transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden group">
    {/* Изображение и бейджи */}
    <div className="relative h-44 bg-white overflow-hidden flex items-center justify-center p-4 border-b border-line">
      {/* В сетке остаётся превью 208px: при object-contain оно рисуется примерно
          в 176px, то есть не растягивается. Оригинал (500px) весит впятеро
          больше и на страницу раздела добавил бы около 1,5 МБ. */}
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />

      {product.badge && (
        <span className="absolute top-3 left-3 bg-brand-green text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded">
          {product.badge}
        </span>
      )}

      <button
        onClick={() => onQuickView(product)}
        className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 cursor-pointer"
      >
        <Eye className="w-4 h-4" />
        <span>Быстрый просмотр</span>
      </button>
    </div>

    {/* Контент */}
    <div className="p-4 flex-1 flex flex-col gap-3">
      <div className="flex-1">
        <div className="text-[11px] text-brand-blue mb-1 line-clamp-1">
          {product.subcategoryName}
        </div>

        <Link
          to={paths.product(product)}
          className="block min-h-11 sm:min-h-0 text-sm font-semibold text-ink line-clamp-2 hover:text-brand-blue transition-colors leading-snug"
        >
          {product.title}
        </Link>

        {product.description && (
          <p className="text-xs text-ink/55 line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {highlights.length > 0 && (
        <div className="bg-surface-soft p-3 rounded-lg text-[11px] space-y-1">
          {highlights.map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <span className="text-ink/45 truncate">{row.label}</span>
              <span className="font-semibold text-ink whitespace-nowrap shrink-0">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-1 mt-auto">
        <Link
          to={paths.product(product)}
          className="border border-line hover:border-brand-sky text-ink text-xs font-semibold min-h-11 py-2.5 px-2 rounded-lg transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-ink/40" />
          <span>Подробнее</span>
        </Link>

        <button
          onClick={() => onAddToQuote(product)}
          className={`text-xs font-semibold min-h-11 py-2.5 px-2 rounded-lg transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer ${
            isAdded
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>В смете</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>В смету</span>
            </>
          )}
        </button>
      </div>
    </div>
  </div>
  );
};

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
  3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch'
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
      <div className="py-16 text-center text-sm text-ink/60 bg-surface-soft rounded-xl border border-line">
        В этом разделе пока нет позиций. Напишите нам — подберём аналог под ваш проект.
      </div>
    );
  }

  return (
    <div className={GRID_COLUMNS[columns]}>
      {products.map((product, idx) => (
        <Reveal key={product.id} delay={Math.min(idx * 0.06, 0.35)} className="h-full">
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
