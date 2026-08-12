import React, { useState } from 'react';
import { X, Check, FileText, ShieldCheck, Layers, Plus, PhoneCall } from 'lucide-react';
import { Product } from '../../types';

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

  const widthOptions = ['15 мм', '20 мм', '70 мм', '100 мм', '150 мм', '200 мм', 'Индивидуальная порезка'];
  const [selectedWidth, setSelectedWidth] = useState(product.specs.width || '70 мм');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#0B5FA5] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#F39200]" />
            <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
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
              <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 h-60 flex items-center justify-center p-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <span className="font-extrabold text-[#0B5FA5] block">
                  Артикул в реестре ИНВИТ:
                </span>
                <span className="font-mono font-bold text-slate-900 block text-sm">
                  {product.code}
                </span>
              </div>
            </div>

            {/* Title & Specs */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <span className="bg-[#F39200] text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded">
                  {product.subcategoryName}
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1 leading-snug">
                  {product.title}
                </h2>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Width Configuration Picker */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-extrabold text-slate-900 block text-xs">
                  Выберите ширину ролика для расчёта сметы:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {widthOptions.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWidth(w)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        selectedWidth === w
                          ? 'bg-[#0B5FA5] text-white border-[#0B5FA5] font-bold shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 font-extrabold text-slate-800 border-b border-slate-200">
                  Технические характеристики СТБ
                </div>
                <div className="divide-y divide-slate-100 p-2 space-y-1 text-slate-700">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-2 py-1">
                      <span className="text-slate-400 capitalize">{key}:</span>
                      <span className="font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
              Преимущества и область применения:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Соответствует стандартам БелТПП РБ</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs uppercase hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Закрыть
            </button>

            <button
              onClick={() => {
                onAddToQuote(product, selectedWidth);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white font-extrabold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#F39200]" />
              <span>Добавить в смету КП</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
