import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Check, Plus, Minus, Phone, Download, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductGrid } from '../components/ProductCard';
import { Lightbox } from '../components/Lightbox';
import { ProductContentBlocks } from '../components/ProductContentBlocks';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { useShop } from '../context/ShopContext';
import { paths, productSlug } from '../routes';
import { variantOptions, sortForListing, dedupeContentBlocks } from '../lib/product';
import { productGallery } from '../lib/contentImages';
import { ProductContent } from '../types';

const sizeWord = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'размеров';
  const mod10 = n % 10;
  if (mod10 === 1) return 'размер';
  if (mod10 >= 2 && mod10 <= 4) return 'размера';
  return 'размеров';
};

export const ProductPage: React.FC = () => {
  const { productSlug: slug } = useParams();
  const shop = useShop();

  const product = PRODUCTS.find((p) => productSlug(p) === slug);

  const [content, setContent] = useState<ProductContent | null>(null);
  const [variant, setVariant] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

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
  // У товара размерный ряд, и каждый типоразмер попадает в корзину отдельной
  // строкой: покупателю обычно нужны две-три ширины одной ленты.
  const inCart = shop.quoteCart.filter((i) => i.product.id === product.id);
  const isAdded = inCart.length > 0;
  const addedThisSize = inCart.find((i) => i.selectedWidth === variant);
  const variants = variantOptions(product);

  const contentBlocks = dedupeContentBlocks(content?.blocks ?? [], product.description);

  const gallery = productGallery(product, content?.images ?? []);

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
          <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-32 lg:self-start">
            <button
              onClick={() => setLightboxIndex(activePhoto)}
              className="flex items-center justify-center w-full max-w-[420px] aspect-square bg-white border border-line rounded-xl overflow-hidden cursor-zoom-in hover:border-brand-sky transition-colors"
              aria-label="Открыть фото"
            >
              {/* w-auto/h-auto: фото не растягивается выше своего разрешения */}
              <img
                src={gallery[activePhoto]}
                alt={product.title}
                width={500}
                height={500}
                className="w-auto h-auto max-w-full max-h-full object-contain p-4"
              />
            </button>

            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2 max-w-[420px]">
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
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
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
                  Типоразмер
                  <span className="ml-2 font-normal text-ink/50">
                    можно заказать несколько размеров
                  </span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((option) => {
                    const already = inCart.find((i) => i.selectedWidth === option);

                    return (
                      <button
                        key={option}
                        onClick={() => setVariant(option)}
                        aria-pressed={variant === option}
                        className={`inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-lg text-xs border transition-colors cursor-pointer ${
                          variant === option
                            ? 'bg-brand-red text-white border-brand-red font-semibold'
                            : 'bg-white text-ink/80 border-line hover:border-brand-sky'
                        }`}
                      >
                        {option}
                        {already && (
                          <span
                            className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold tabular-nums ${
                              variant === option ? 'bg-white/25 text-white' : 'bg-brand-blue text-white'
                            }`}
                            title={`В корзине: ${already.quantity}`}
                          >
                            {already.quantity}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Сколько добавить: клиент просил класть в корзину несколько сразу */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink">Количество</span>
                <div className="flex items-center rounded-lg border border-line overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    aria-label="Убавить количество"
                    disabled={qty <= 1}
                    className="flex items-center justify-center w-11 h-11 text-ink hover:bg-surface-soft disabled:opacity-40 disabled:cursor-default transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.round(Number(e.target.value) || 1)))}
                    aria-label="Количество"
                    className="w-14 h-11 text-center text-sm font-semibold text-ink border-x border-line tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setQty((v) => v + 1)}
                    aria-label="Прибавить количество"
                    className="flex items-center justify-center w-11 h-11 text-ink hover:bg-surface-soft transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-ink/50">рул. / шт.</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => shop.addToQuote(product, variant, qty)}
                  className={`flex-1 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    addedThisSize
                      ? 'bg-brand-navy hover:bg-brand-navy/90 text-white'
                      : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                  }`}
                >
                  {addedThisSize ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {addedThisSize ? 'Добавить ещё' : 'Добавить в корзину'}
                </button>

                <button
                  onClick={() => shop.openCallback(`Запрос по позиции: ${product.title}`)}
                  className="flex-1 px-5 py-3.5 rounded-lg border border-line text-ink text-sm font-semibold hover:border-brand-sky transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-brand-blue" />
                  Уточнить цену
                </button>
              </div>

              {isAdded && (
                <Link
                  to={paths.cart}
                  className="flex items-center justify-center gap-2 min-h-11 rounded-lg border border-brand-blue text-brand-blue text-sm font-semibold hover:bg-brand-blue/5 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  В корзине {inCart.length} {sizeWord(inCart.length)} — перейти
                </Link>
              )}

              <p className="flex items-start gap-2 text-xs text-ink/50">
                <ShieldCheck className="w-4 h-4 text-brand-sky shrink-0" />
                Документы по качеству предоставляем с каждой партией —{' '}
                <Link to={paths.certificates} className="text-brand-blue hover:underline">
                  сертификаты
                </Link>
              </p>
            </div>

            {/* Полное описание с сайта */}
            {contentBlocks.length ? (
              <ProductContentBlocks
                blocks={contentBlocks}
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
