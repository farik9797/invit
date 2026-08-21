import React, { useState } from 'react';
import { X, Check, FileText, ShieldCheck, Layers, Plus, PhoneCall } from 'lucide-react';
import { Product } from '../../types';
import { variantOptions } from '../../lib/product';
import { productImage } from '../../lib/productImages';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToQuote: (product: Product, selectedWidth?: string) => void;
  isAdded: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToQuote,
  isAdded
}) => {
  if (!product) return null;

  const widthOptions = variantOptions(product);
  const [selectedWidth, setSelectedWidth] = useState(variantOptions(product)[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-xl max-w-[60rem] w-full shadow-lg border border-line overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm sm:text-base tracking-wide uppercase">
              Технический Паспорт Изделия (ТДС) — EUROBAND
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image */}
            <div className="md:col-span-5 space-y-3">
              <div className="bg-surface-soft rounded-xl overflow-hidden border border-line h-60 flex items-center justify-center p-2">
                <img
                  src={productImage(product)}
                  alt={product.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="p-3 bg-brand-sky-soft border border-line rounded-xl text-xs space-y-1">
                <span className="font-semibold text-brand-blue block">
                  Раздел каталога:
                </span>
                <span className="font-bold text-ink block text-sm">
                  {product.subcategoryName}
                </span>
              </div>
            </div>

            {/* Title & Specs */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <span className="bg-brand-red text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded">
                  {product.subcategoryName}
                </span>
                <h2 className="text-lg font-bold text-ink mt-1 leading-snug">
                  {product.title}
                </h2>
                <p className="text-ink/70 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Width Configuration Picker */}
              <div className="p-3 bg-surface-soft rounded-xl border border-line space-y-2">
                <label className="font-semibold text-ink block text-xs">
                  Типоразмер для расчёта сметы:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {widthOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWidth(w)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        selectedWidth === w
                          ? 'bg-brand-blue text-white border-brand-blue font-bold shadow-sm'
                          : 'bg-white text-ink/80 border-line hover:bg-surface-soft'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="border border-line rounded-xl overflow-hidden">
                <div className="bg-surface-soft px-3 py-2 font-semibold text-ink border-b border-line">
                  Технические характеристики
                </div>
                <div className="divide-y divide-line p-2 space-y-1 text-ink/80">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-3 px-2 py-1">
                      <span className="text-ink/45">{spec.label}</span>
                      <span className="font-bold text-ink text-right">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2 pt-2 border-t border-line">
            <h4 className="font-semibold text-sm text-ink/55">
              Преимущества и область применения:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink/80 font-medium">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-surface-soft border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-ink/55 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Соответствует стандартам БелТПП РБ</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-line text-ink/80 font-semibold text-sm hover:bg-surface-soft transition-colors cursor-pointer"
            >
              Закрыть
            </button>

            <button
              onClick={() => {
                onAddToQuote(product, selectedWidth);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold text-sm shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Добавить в смету КП</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
