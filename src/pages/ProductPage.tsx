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
import { sortForListing, dedupeContentBlocks } from '../lib/product';
import { hasPrice, priceLabel } from '../lib/price';
import { productUnit } from '../lib/unit';
import { crossSell } from '../lib/crossSell';
import { contentImage, productGallery } from '../lib/contentImages';
import { SectionIcon } from '../lib/sectionIcons';
import { ProductContent } from '../types';

export const ProductPage: React.FC = () => {
  const { productSlug: slug } = useParams();
  const shop = useShop();

  const product = PRODUCTS.find((p) => productSlug(p) === slug);

  const [content, setContent] = useState<ProductContent | null>(null);
  // Полное описание: в витрине лежит только начало, остальное приходит сюда
  const [fullText, setFullText] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | null>(null);

  // Полное описание и галерея грузятся отдельным чанком — только на этой странице.
  useEffect(() => {
    let cancelled = false;
    setContent(null);
    setFullText(null);
    setActivePhoto(0);
    setVariant(null);
    import('../data/productContent').then(({ PRODUCT_CONTENT }) => {
      // Описания лежат по идентификатору товара, а не по адресу страницы
      if (!cancelled && product) setContent(PRODUCT_CONTENT[product.id] ?? null);
    });
    import('../data/catalogDescriptions').then(({ DESCRIPTIONS }) => {
      if (!cancelled && product) setFullText(DESCRIPTIONS[product.id] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, product]);

  useEffect(() => {
  }, [product]);

  if (!product) return <Navigate to={paths.catalog} replace />;

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  // Исполнение по умолчанию — первое в списке: он отсортирован по размеру.
  const chosen = variant ?? product.variants?.[0]?.value ?? null;
  const chosenSku = product.variants?.find((o) => o.value === chosen)?.sku;
  const unit = productUnit(product);
  const isAdded = shop.quoteCart.some(
    (i) => i.product.id === product.id && (chosen === null || i.variant === chosen)
  );

  const description = fullText ?? product.description;
  const contentBlocks = dedupeContentBlocks(content?.blocks ?? [], description);

  const gallery = productGallery(product, content?.images ?? []);

  /*
   * Подписи к кадрам галереи. Иллюстрации идут в её хвосте в том же порядке,
   * что и блоки описания, поэтому длина хвоста и даёт смещение: снимка товара
   * может не быть вовсе, и тогда галерея состоит из одних иллюстраций.
   */
  const illustrations = (content?.blocks ?? []).filter((b) => b.kind === 'image');
  const captions = gallery.map((_, idx) => {
    const shift = gallery.length - illustrations.length;
    return (idx >= shift && illustrations[idx - shift].title) || product.title;
  });

  /*
   * Сопутствующие: сначала соседи по подразделу, потом остальной раздел.
   * В подразделе бывает один-единственный товар (лента для сэндвич-панелей),
   * и блок оставался пустым — а он теперь заменяет перечень ссылок, который
   * раньше стоял в самом описании.
   */
  const siblings = PRODUCTS.filter(
    (p) => p.subcategorySlug === product.subcategorySlug && p.id !== product.id
  );
  const nearby = PRODUCTS.filter(
    (p) =>
      p.categorySlug === product.categorySlug &&
      p.subcategorySlug !== product.subcategorySlug
  );
  const related = [...sortForListing(siblings), ...sortForListing(nearby)].slice(0, 4);
  const companions = crossSell(product);

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
            {gallery.length > 0 ? (
              <button
                onClick={() => setLightboxIndex(activePhoto)}
                className="flex items-center justify-center w-full max-w-[420px] aspect-square bg-white border border-line rounded-xl overflow-hidden cursor-zoom-in hover:border-brand-sky transition-colors"
                aria-label="Открыть фото"
              >
                {/* w-auto/h-auto: фото не растягивается выше своего разрешения */}
                <img
                  src={gallery[activePhoto]}
                  alt={captions[activePhoto]}
                  width={500}
                  height={500}
                  className="w-auto h-auto max-w-full max-h-full object-contain p-4"
                />
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 w-full max-w-[420px] aspect-square bg-white border border-line rounded-xl text-line">
                <SectionIcon slug={product.subcategorySlug} size={96} className="w-24 h-24" />
                <span className="text-xs text-ink/40">Фото уточняйте у менеджера</span>
              </div>
            )}

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
                    <img
                      src={src}
                      alt={captions[idx]}
                      title={captions[idx]}
                      loading="lazy"
                      className="w-full h-full object-contain p-1.5"
                    />
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

              {/* Цена из выгрузки поставщика. У карточки с исполнениями она
                  «от»: разные типоразмеры стоят по-разному. */}
              <p
                className={`mt-3 font-bold ${
                  hasPrice(product) ? 'text-2xl text-ink' : 'text-base font-semibold text-ink/60'
                }`}
              >
                {priceLabel(product)}
              </p>
              {description && (
                <p className="text-sm text-ink/70 mt-4 leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              )}
            </div>

            {/* Характеристики */}
            {product.specs.length > 0 && (
              <div className="border border-line rounded-xl overflow-hidden">
                <div className="bg-surface-soft px-4 py-2.5 text-xs font-semibold text-ink">
                  Параметры
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

            {/* Исполнения: одна карточка вместо десятков одинаковых позиций */}
            {product.variants && product.variants.length > 0 && (
              <div className="border border-line rounded-xl p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs font-semibold text-ink">
                    {product.variantLabel ?? 'Исполнение'}
                  </span>
                  <span className="text-[11px] text-ink/50">
                    {product.variants.length} на выбор
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((option) => (
                    <button
                      key={option.sku}
                      type="button"
                      onClick={() => setVariant(option.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-blue ${
                        option.value === chosen
                          ? 'border-brand-blue text-brand-blue bg-brand-blue/5'
                          : 'border-line text-ink hover:border-brand-sky'
                      }`}
                    >
                      {option.value}
                    </button>
                  ))}
                </div>
                {/* Артикул у каждого исполнения свой. Внутренние коды
                    поставщика («ЦБ-0000608166») покупателю не показываем: по
                    ним ничего не найти, это номенклатура его склада. */}
                {chosenSku && !/^Ц[БВЗГИЕД]-/.test(chosenSku) && (
                  <div className="mt-3 text-xs text-ink/60">Артикул: {chosenSku}</div>
                )}
              </div>
            )}

            {/* Количество и действия */}
            <div className="border border-line rounded-xl p-5 space-y-4">
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
                {/* Крепёж отгружают коробами: «1» — это короб на тысячу
                    саморезов, и подписывать его штукой неверно. */}
                <span className="text-xs text-ink/50">
                  {unit.short}
                  {unit.hint && <span className="ml-1 text-ink/40">{unit.hint}</span>}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => shop.addToQuote(product, qty, chosen ?? undefined)}
                  className={`flex-1 px-5 py-3.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded
                      ? 'bg-brand-navy hover:bg-brand-navy/90 text-white'
                      : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                  }`}
                >
                  {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {isAdded ? 'Добавить ещё' : 'Добавить в корзину'}
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
                  Перейти в корзину
                </Link>
              )}

              {/* Сертификаты и декларации есть только на свои ленты: на товар
                  прямой поставки документы даёт производитель, а не мы. */}
              {product.badge === 'Собственное производство' && (
                <p className="flex items-start gap-2 text-xs text-ink/50">
                  <ShieldCheck className="w-4 h-4 text-brand-sky shrink-0" />
                  Документы по качеству предоставляем с каждой партией —{' '}
                  <Link to={paths.certificates} className="text-brand-blue hover:underline">
                    сертификаты
                  </Link>
                </p>
              )}
            </div>

            {/* Полное описание с сайта */}
            {contentBlocks.length ? (
              <ProductContentBlocks
                blocks={contentBlocks}
                onImageClick={(src) => {
                  // В галерее лежит локальная копия, а в описании — исходный
                  // адрес invit.by: без перевода клик открывал первый кадр.
                  const idx = gallery.indexOf(contentImage(src));
                  setLightboxIndex(idx >= 0 ? idx : 0);
                  if (idx >= 0) setActivePhoto(idx);
                }}
              />
            ) : null}
          </div>
        </div>
      </section>

      {companions.length > 0 && (
        <section className="py-14 border-t border-line">
          <div className="max-w-[1340px] mx-auto px-5 space-y-6">
            <h2 className="text-xl font-bold text-ink tracking-tight">
              С этим товаром часто покупают
            </h2>
            <ProductGrid
              products={companions}
              quoteItemsIds={shop.quoteCart.map((i) => i.product.id)}
              onQuickView={shop.openQuickView}
              onAddToQuote={shop.addToQuote}
            />
          </div>
        </section>
      )}

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
        alt={lightboxIndex === null ? product.title : captions[lightboxIndex]}
        onClose={() => setLightboxIndex(null)}
        onChange={(idx) => {
          setLightboxIndex(idx);
          setActivePhoto(idx);
        }}
      />
    </>
  );
};
