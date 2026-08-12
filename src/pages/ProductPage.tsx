import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Check, ShieldCheck, Plus, Phone, FileText, Download, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths, productSlug } from '../routes';
import { variantOptions } from '../lib/product';

export const ProductPage: React.FC = () => {
  const { productSlug: slug } = useParams();
  const shop = useShop();

  const product = PRODUCTS.find((p) => productSlug(p) === slug);
  const [selectedWidth, setSelectedWidth] = useState<string>(
    product ? variantOptions(product)[0] : ''
  );

  if (!product) return <Navigate to={paths.catalog} replace />;

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const isAdded = shop.quoteCart.some((i) => i.product.id === product.id);

  const widthOptions = variantOptions(product);

  const related = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Каталог', to: paths.catalog },
          ...(category ? [{ label: category.name, to: paths.category(category.slug) }] : []),
          { label: product.title }
        ]}
      />

      <section className="max-w-[1340px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Изображение */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 aspect-4/3">
              <img
                src={product.imageLarge || product.image}
                alt={product.title}
                className="w-full h-full object-contain bg-white"
              />
            </div>

            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs font-bold text-brand-blue hover:bg-blue-100 transition-colors"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Технический лист (PDF)</span>
              </a>
            )}
          </div>

          {/* Описание и заказ */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {product.badge && (
                  <span className="bg-brand-red text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-md">
                    {product.badge}
                  </span>
                )}
                <span className="text-[11px] font-bold text-brand-blue uppercase tracking-wider">
                  {product.subcategoryName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{product.description}</p>
            </div>

            {/* Выбор ширины */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="font-extrabold text-slate-900 block text-xs">
                Типоразмер для расчёта сметы:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {widthOptions.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setSelectedWidth(w)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedWidth === w
                        ? 'bg-brand-blue text-white border-brand-blue font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Действия */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => shop.addToQuote(product, selectedWidth)}
                className={`flex-1 px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isAdded ? 'Добавлено в смету' : 'Добавить в смету КП'}</span>
              </button>

              <button
                onClick={() => shop.openCallback(`Запрос по позиции: ${product.title}`)}
                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-brand-red" />
                <span>Уточнить цену и наличие</span>
              </button>
            </div>

            {/* Характеристики */}
            {product.specs.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <div className="bg-slate-100 px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                Технические характеристики
              </div>
              <dl className="divide-y divide-slate-100 text-xs">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500">{spec.label}</dt>
                    <dd className="font-bold text-slate-900 text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            )}

            {/* Размерный ряд */}
            {product.sizes && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-100 px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
                  Размерный ряд
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[420px]">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-left">
                        {product.sizes.headers.map((h) => (
                          <th key={h} className="px-3 py-2 font-semibold whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {product.sizes.rows.map((row, idx) => (
                        <tr key={idx} className="text-slate-800">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`px-3 py-2 ${cIdx === 0 ? 'font-bold text-slate-900' : ''}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Преимущества */}
            {product.features.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Преимущества и область применения
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Документы по качеству предоставляем с каждой партией —{' '}
                <Link to={paths.certificates} className="text-brand-blue font-semibold hover:underline">
                  смотреть сертификаты
                </Link>
              </span>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-12 bg-white border-t border-slate-200">
          <div className="max-w-[1340px] mx-auto px-5 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Смотрите также в разделе «{category?.name}»
            </h2>
            <ProductGrid
              products={related}
              quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
              onQuickView={shop.openQuickView}
              onAddToQuote={shop.addToQuote}
            />
          </div>
        </section>
      )}
    </>
  );
};
