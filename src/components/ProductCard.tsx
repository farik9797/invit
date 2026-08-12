import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Plus, Check, Eye } from 'lucide-react';
import { Product } from '../types';
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
  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
    {/* Изображение и бейджи */}
    <div className="relative h-48 bg-white overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
      <img
        src={product.image}
        alt={product.title}
        loading="lazy"
        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
      />

      {product.badge && (
        <span className="absolute top-3 left-3 bg-brand-red text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-2xs">
          {product.badge}
        </span>
      )}

      <button
        onClick={() => onQuickView(product)}
        className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase gap-1.5 backdrop-blur-xs cursor-pointer"
      >
        <Eye className="w-4 h-4 text-brand-red-light" />
        <span>Быстрый просмотр</span>
      </button>
    </div>

    {/* Контент */}
    <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
      <div>
        <div className="text-[11px] font-bold text-brand-blue uppercase tracking-wider mb-1">
          {product.subcategoryName}
        </div>

        <Link
          to={paths.product(product)}
          className="block text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-brand-blue transition-colors leading-snug"
        >
          {product.title}
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {highlights.length > 0 && (
        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
          {highlights.map((row) => (
            <div key={row.label} className="flex justify-between gap-2">
              <span className="text-slate-400 font-medium truncate">{row.label}</span>
              <span className="font-bold text-slate-900 whitespace-nowrap shrink-0">{row.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="block text-[10px] text-slate-400 uppercase font-bold">Цена для опта:</span>
          <span className="text-xs font-bold text-brand-blue">По запросу / В смету</span>
        </div>

        <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-500" /> Наличие по запросу
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Link
          to={paths.product(product)}
          className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Подробнее</span>
        </Link>

        <button
          onClick={() => onAddToQuote(product)}
          className={`font-bold text-xs py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
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
              <span>В прайс КП</span>
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
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  quoteItemsIds,
  onQuickView,
  onAddToQuote
}) => {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
        В этом разделе пока нет позиций. Напишите нам — подберём аналог под ваш проект.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isAdded={quoteItemsIds.includes(product.id)}
          onQuickView={onQuickView}
          onAddToQuote={onAddToQuote}
        />
      ))}
    </div>
  );
};
