import React, { useState } from 'react';
import { Package, ShieldCheck, FileText, Plus, Check, Eye, SlidersHorizontal, Layers, Wind } from 'lucide-react';
import { PRODUCTS } from '../data/catalogData';
import { Product } from '../types';

interface ProductCatalogSectionProps {
  onSelectProduct: (product: Product) => void;
  onAddToQuote: (product: Product) => void;
  quoteItemsIds: string[];
  selectedCategorySlug: string | null;
  onResetCategoryFilter: () => void;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  onSelectProduct,
  onAddToQuote,
  quoteItemsIds,
  selectedCategorySlug,
  onResetCategoryFilter
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'windows' | 'hvac' | 'hits'>('all');

  let displayedProducts = PRODUCTS;

  // If a global category slug is passed from the sidebar/tile click
  if (selectedCategorySlug) {
    displayedProducts = PRODUCTS.filter((p) => p.categorySlug === selectedCategorySlug);
  } else {
    if (activeTab === 'windows') {
      displayedProducts = PRODUCTS.filter((p) => p.division === 'windows');
    } else if (activeTab === 'hvac') {
      displayedProducts = PRODUCTS.filter((p) => p.division === 'hvac');
    } else if (activeTab === 'hits') {
      displayedProducts = PRODUCTS.filter((p) => p.badge === 'Хит' || p.badge === 'Собственное производство');
    }
  }

  return (
    <section id="catalog" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* Header & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5FA5] mb-1.5">
              <Package className="w-4 h-4 text-[#F39200]" />
              <span>B2B Каталог Продукции</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Популярные товары & Хиты продаж EUROBAND
            </h2>
          </div>

          {/* Filter Tabs - flex-wrap with max-w-[1000px] to fit tabs neatly */}
          <div className="w-full max-w-[1000px] flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
            {selectedCategorySlug && (
              <button
                onClick={onResetCategoryFilter}
                className="text-xs font-bold px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>Сбросить фильтр категории ✕</span>
              </button>
            )}

            <button
              onClick={() => {
                onResetCategoryFilter();
                setActiveTab('all');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === 'all' && !selectedCategorySlug
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              Все товары ({PRODUCTS.length})
            </button>

            <button
              onClick={() => {
                onResetCategoryFilter();
                setActiveTab('hits');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'hits' && !selectedCategorySlug
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <span className="text-[#F39200]">★</span>
              <span>Хиты & Собственный прокат</span>
            </button>

            <button
              onClick={() => {
                onResetCategoryFilter();
                setActiveTab('windows');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'windows' && !selectedCategorySlug
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Оконный монтаж</span>
            </button>

            <button
              onClick={() => {
                onResetCategoryFilter();
                setActiveTab('hvac');
              }}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeTab === 'hvac' && !selectedCategorySlug
                  ? 'bg-[#0B5FA5] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Вентиляция</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => {
            const isAdded = quoteItemsIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image & Badge Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-[#F39200] text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-2xs">
                      {product.badge}
                    </span>
                  )}

                  {/* Article Tag */}
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {product.code}
                  </span>

                  {/* Quick Detail Overlay Button */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs uppercase gap-1.5 backdrop-blur-xs cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#F39200]" />
                    <span>Быстрый просмотр / ТДС</span>
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                  <div>
                    {/* Category Label */}
                    <div className="text-[11px] font-bold text-[#0B5FA5] uppercase tracking-wider mb-1">
                      {product.subcategoryName}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-extrabold text-slate-900 line-clamp-2 hover:text-[#0B5FA5] cursor-pointer transition-colors leading-snug"
                    >
                      {product.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  {/* Tech Specs Box */}
                  <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 space-y-1">
                    {product.specs.width && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Ширина:</span>
                        <span className="font-bold text-slate-900">{product.specs.width}</span>
                      </div>
                    )}
                    {product.specs.length && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Намотка:</span>
                        <span className="font-bold text-slate-900">{product.specs.length}</span>
                      </div>
                    )}
                    {product.specs.material && (
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Основа:</span>
                        <span className="font-bold text-slate-900 truncate max-w-[140px]">{product.specs.material}</span>
                      </div>
                    )}
                  </div>

                  {/* Price Tag Replacement for B2B */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">
                        Цена для опта:
                      </span>
                      <span className="text-xs font-bold text-[#0B5FA5]">
                        По запросу / В смету
                      </span>
                    </div>

                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> На складе РБ
                    </span>
                  </div>

                  {/* B2B Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs py-2 px-2 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Паспорт / ТДС</span>
                    </button>

                    <button
                      onClick={() => onAddToQuote(product)}
                      className={`font-bold text-xs py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>В смете</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#F39200]" />
                          <span>В прайс КП</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
