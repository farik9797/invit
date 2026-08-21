import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Check, Plus, Phone, Download, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { Lightbox } from '../components/Lightbox';
import { ProductContentBlocks } from '../components/ProductContentBlocks';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths, productSlug } from '../routes';
import { variantOptions, sortForListing } from '../lib/product';
import { ProductContent } from '../types';

export const ProductPage: React.FC = () => {
  const { productSlug: slug } = useParams();
  const shop = useShop();

  const product = PRODUCTS.find((p) => productSlug(p) === slug);

  const [content, setContent] = useState<ProductContent | null>(null);
  const [variant, setVariant] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Полное описание и галерея грузятся отдельным чанком — только на этой странице.
  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setActivePhoto(0);
    import('../data/productContent').then(({ PRODUCT_CONTENT }) => {
      if (!cancelled && slug) setContent(PRODUCT_CONTENT[slug] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (product) setVariant(variantOptions(product)[0]);
  }, [product]);

  if (!product) return <Navigate to={paths.catalog} replace />;

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const isAdded = shop.quoteCart.some((i) => i.product.id === product.id);
  const variants = variantOptions(product);

  const gallery = content?.images.length
    ? content.images
    : [product.imageLarge || product.image].filter(Boolean);

  const related = sortForListing(
    PRODUCTS.filter((p) => p.subcategorySlug === product.subcategorySlug && p.id !== product.id)
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

      <section className="max-w-[1340px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Галерея */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-32 lg:self-start">
            <button
              onClick={() => setLightboxIndex(activePhoto)}
              className="block w-full aspect-square bg-white border border-line rounded-xl overflow-hidden cursor-zoom-in hover:border-brand-sky transition-colors"
              aria-label="Открыть фото"
            >
              <img
                src={gallery[activePhoto]}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            </button>

            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {gallery.map((src, idx) => (
                  <button
                    key={src}
                    onClick={() => setActivePhoto(idx)}
                    onDoubleClick={() => setLightboxIndex(idx)}
                    className={`aspect-square bg-white border rounded-lg overflow-hidden transition-colors cursor-pointer ${
                      idx === activePhoto ? 'border-brand-blue' : 'border-line hover:border-brand-sky'
                    }`}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-contain p-1.5" />
                  </button>
                ))}
              </div>
            )}

            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-4 py-3.5 border border-line rounded-xl text-sm font-semibold text-brand-blue hover:border-brand-sky transition-colors"
              >
                <Download className="w-4 h-4 shrink-0" />
                Технический лист (PDF)
              </a>
            )}
          </div>

          {/* Заказ */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.badge && (
                  <span className="bg-brand-green text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
                    {product.badge}
                  </span>
                )}
                <Link
                  to={`${paths.category(product.categorySlug)}?sub=${product.subcategorySlug}`}
                  className="text-[11px] text-brand-blue hover:text-brand-blue-hover transition-colors"
                >
                  {product.subcategoryName}
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-snug">
                {product.title}
              </h1>
              {product.description && (
                <p className="text-sm text-ink/70 mt-4 leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Характеристики */}
            {product.specs.length > 0 && (
              <div className="border border-line rounded-xl overflow-hidden">
                <div className="bg-surface-soft px-4 py-2.5 text-xs font-semibold text-ink">
                  Технические характеристики
                </div>
                <dl className="divide-y divide-line text-sm">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-6 px-4 py-3">
                      <dt className="text-ink/60">{spec.label}</dt>
                      <dd className="font-semibold text-ink text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Типоразмер и действия */}
            <div className="border border-line rounded-xl p-5 space-y-4">
              <div className="space-y-2.5">
                <span className="block text-xs font-semibold text-ink">
                  Типоразмер для расчёта сметы
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((option) => (
                    <button
                      key={option}
                      onClick={() => setVariant(option)}
                      className={`inline-flex items-center min-h-11 px-3.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                        variant === option
                          ? 'bg-brand-red text-white border-brand-red font-semibold'
                          : 'bg-white text-ink/80 border-line hover:border-brand-sky'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => shop.addToQuote(product, variant)}
                  className={`flex-1 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAdded ? 'Добавлено в смету' : 'Добавить в смету'}
                </button>

                <button
                  onClick={() => shop.openCallback(`Запрос по позиции: ${product.title}`)}
                  className="flex-1 px-5 py-3.5 rounded-lg border border-line text-ink text-sm font-semibold hover:border-brand-sky transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-brand-blue" />
                  Уточнить цену
                </button>
              </div>

              <p className="flex items-start gap-2 text-xs text-ink/50">
                <ShieldCheck className="w-4 h-4 text-brand-sky shrink-0" />
                Документы по качеству предоставляем с каждой партией —{' '}
                <Link to={paths.certificates} className="text-brand-blue hover:underline">
                  сертификаты
                </Link>
              </p>
            </div>

            {/* Полное описание с сайта */}
            {content?.blocks.length ? (
              <ProductContentBlocks
                blocks={content.blocks}
                onImageClick={(src) => {
                  const idx = gallery.indexOf(src);
                  setLightboxIndex(idx >= 0 ? idx : 0);
                  if (idx >= 0) setActivePhoto(idx);
                }}
              />
            ) : null}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-14 bg-surface-soft border-t border-line">
          <div className="max-w-[1340px] mx-auto px-5 space-y-6">
            <h2 className="text-xl font-bold text-ink tracking-tight">
              Другие позиции раздела
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

      <Lightbox
        images={gallery}
        index={lightboxIndex}
        alt={product.title}
        onClose={() => setLightboxIndex(null)}
        onChange={(idx) => {
          setLightboxIndex(idx);
          setActivePhoto(idx);
        }}
      />
    </>
  );
};
