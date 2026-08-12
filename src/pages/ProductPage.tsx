import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Check, ShieldCheck, Plus, Phone, FileText } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths, productSlug } from '../routes';

const SPEC_LABELS: Record<string, string> = {
  width: 'Ширина',
  length: 'Длина / намотка',
  density: 'Плотность',
  tempRange: 'Диапазон температур',
  thickness: 'Толщина',
  material: 'Основа / материал',
  packaging: 'Упаковка',
  class: 'Класс'
};

export const ProductPage: React.FC = () => {
  const { productSlug: slug } = useParams();
  const shop = useShop();

  const product = PRODUCTS.find((p) => productSlug(p) === slug);
  const [selectedWidth, setSelectedWidth] = useState<string>(product?.specs.width || '');

  if (!product) return <Navigate to={paths.catalog} replace />;

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const isAdded = shop.quoteCart.some((i) => i.product.id === product.id);

  const widthOptions = product.specs.width
    ? [product.specs.width, '10 мм', '50 мм', '100 мм', '150 мм', 'Нестандарт (под заказ)']
    : ['Стандарт', 'Нестандарт (под заказ)'];

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
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs">
              <span className="font-extrabold text-brand-blue block mb-0.5">
                Артикул в реестре ИНВИТ
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">{product.code}</span>
            </div>
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
                Ширина ролика для расчёта сметы:
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
                onClick={() => shop.openCallback(`Запрос по позиции ${product.code}: ${product.title}`)}
                className="flex-1 px-5 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-brand-red" />
                <span>Уточнить цену и наличие</span>
              </button>
            </div>

            {/* Характеристики */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <div className="bg-slate-100 px-4 py-2.5 font-extrabold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                Технические характеристики
              </div>
              <dl className="divide-y divide-slate-100 text-xs">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 px-4 py-2.5">
                    <dt className="text-slate-500">{SPEC_LABELS[key] || key}</dt>
                    <dd className="font-bold text-slate-900 text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Преимущества */}
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
