import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AdvantagesBar } from './components/AdvantagesBar';
import { FeaturedCategories } from './components/FeaturedCategories';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { CustomCutBanner } from './components/CustomCutBanner';
import { ManufacturingSection } from './components/ManufacturingSection';
import { OrderStatusModule } from './components/OrderStatusModule';
import { CertificatesSection } from './components/CertificatesSection';
import { NewsSection } from './components/NewsSection';
import { QuoteFormSection } from './components/QuoteFormSection';
import { Footer } from './components/Footer';

// Modals
import { ProductDetailModal } from './components/Modals/ProductDetailModal';
import { QuoteCartModal } from './components/Modals/QuoteCartModal';
import { CallbackModal } from './components/Modals/CallbackModal';
import { CertificateModal } from './components/Modals/CertificateModal';
import { NewsDetailModal } from './components/Modals/NewsDetailModal';

import { Product, QuoteCartItem, CertificateItem, NewsArticle } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('main');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Quote Basket State
  const [quoteCart, setQuoteCart] = useState<QuoteCartItem[]>([]);
  const [isQuoteCartOpen, setIsQuoteCartOpen] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackCustomNote, setCallbackCustomNote] = useState('');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);

  // Add item to quote cart
  const handleAddToQuote = (product: Product, width?: string) => {
    const selectedWidth = width || product.specs.width || '70 мм';
    setQuoteCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, selectedWidth, quantity: 10 }];
    });
    setIsQuoteCartOpen(true);
  };

  const handleRemoveFromQuote = (productId: string) => {
    setQuoteCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuoteQty = (productId: string, qty: number) => {
    setQuoteCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleClearQuoteCart = () => {
    setQuoteCart([]);
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    setActiveSection('catalog');
    const catalogElement = document.getElementById('catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCallbackWithNote = (note: string) => {
    setCallbackCustomNote(note);
    setIsCallbackOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#0B5FA5] selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. HEADER */}
      <Header
        onOpenCallback={() => {
          setCallbackCustomNote('');
          setIsCallbackOpen(true);
        }}
        onOpenQuoteCart={() => setIsQuoteCartOpen(true)}
        quoteCount={quoteCart.length}
        onSelectProduct={(product) => setSelectedProduct(product)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* MAIN CONTENT LANDING BODY */}
      <main className="flex-1">
        
        {/* 3. HERO SECTION (SmartTech index-3: Left mega-menu catalog + Right hero slider) */}
        <div id="main">
          <HeroSection
            onSelectCategory={handleSelectCategory}
            onOpenCallback={() => {
              setCallbackCustomNote('Запрос оптового прайс-листа со слайдера');
              setIsCallbackOpen(true);
            }}
          />
        </div>

        {/* 4. ADVANTAGES BAR (4 icons) */}
        <AdvantagesBar />

        {/* 5. FEATURED CATEGORIES TILE GRID (2x3) */}
        <FeaturedCategories onSelectCategory={handleSelectCategory} />

        {/* 6. PRODUCT CATALOG & HITS CAROUSEL/TABBED GRID */}
        <ProductCatalogSection
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToQuote={(product, width) => handleAddToQuote(product, width)}
          quoteItemsIds={quoteCart.map((i) => i.product.id)}
          selectedCategorySlug={selectedCategorySlug}
          onResetCategoryFilter={() => setSelectedCategorySlug(null)}
        />

        {/* 7. CUSTOM CUT PROMO BANNER & CALCULATOR */}
        <CustomCutBanner onOpenCallbackWithNote={handleOpenCallbackWithNote} />

        {/* 8. MANUFACTURING & ABOUT SECTION */}
        <ManufacturingSection
          onOpenCallback={() => {
            setCallbackCustomNote('Запрос информации о заводе и презентации');
            setIsCallbackOpen(true);
          }}
          onOpenCertificates={() => {
            setActiveSection('certificates');
            document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 9. ORDER STATUS TRACKING MODULE */}
        <OrderStatusModule />

        {/* 10. CERTIFICATES & TRUST STRIP */}
        <CertificatesSection onSelectCertificate={(cert) => setSelectedCertificate(cert)} />

        {/* 11. NEWS SECTION */}
        <NewsSection onSelectNews={(article) => setSelectedNews(article)} />

        {/* 12. B2B QUOTE & COOPERATION FORM */}
        <QuoteFormSection initialNote={callbackCustomNote} />

      </main>

      {/* 13. FOOTER */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenCallback={() => setIsCallbackOpen(true)}
        setActiveSection={setActiveSection}
      />

      {/* INTERACTIVE MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToQuote={handleAddToQuote}
        isAdded={selectedProduct ? quoteCart.some((i) => i.product.id === selectedProduct.id) : false}
      />

      <QuoteCartModal
        isOpen={isQuoteCartOpen}
        onClose={() => setIsQuoteCartOpen(false)}
        items={quoteCart}
        onRemoveItem={handleRemoveFromQuote}
        onUpdateQuantity={handleUpdateQuoteQty}
        onClearCart={handleClearQuoteCart}
      />

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
        customNote={callbackCustomNote}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <NewsDetailModal
        article={selectedNews}
        onClose={() => setSelectedNews(null)}
      />

    </div>
  );
}
