import React, { useState, useEffect } from 'react';
import { PhoneCall, ShoppingBag, ChevronUp } from 'lucide-react';
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

  // Back to top button state
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-brand-blue selection:text-white flex flex-col justify-between">
      
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

        {/* 5. FEATURED CATEGORIES TILE GRID */}
        <FeaturedCategories onSelectCategory={handleSelectCategory} />

        {/* 6. CUSTOM CUT PROMO BANNER & CALCULATOR */}
        <CustomCutBanner onOpenCallbackWithNote={handleOpenCallbackWithNote} />

        {/* 7. MANUFACTURING & ABOUT SECTION */}
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

        {/* 8. PRODUCT CATALOG & HITS TABBED GRID */}
        <ProductCatalogSection
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToQuote={(product, width) => handleAddToQuote(product, width)}
          quoteItemsIds={quoteCart.map((i) => i.product.id)}
          selectedCategorySlug={selectedCategorySlug}
          onResetCategoryFilter={() => setSelectedCategorySlug(null)}
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

      {/* FLOATING ACTION BUTTON (Call / Quote Quick Access / Back to Top) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="pointer-events-auto bg-slate-900/90 hover:bg-slate-950 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center border-2 border-white/80 transition-all transform hover:scale-110 cursor-pointer group backdrop-blur"
            title="Наверх"
            aria-label="Наверх"
          >
            <ChevronUp className="w-5 h-5 text-[#F39200] group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {quoteCart.length > 0 && (
          <button
            onClick={() => setIsQuoteCartOpen(true)}
            className="pointer-events-auto bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white transition-all transform hover:scale-105 cursor-pointer group"
            title="Открыть смету КП"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#F39200]" />
              <span className="absolute -top-2 -right-2 bg-[#F39200] text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {quoteCart.length}
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline pr-1">
              Смета КП ({quoteCart.length})
            </span>
          </button>
        )}

        <button
          onClick={() => {
            setCallbackCustomNote('Быстрый звонок с плавающей кнопки');
            setIsCallbackOpen(true);
          }}
          className="pointer-events-auto bg-[#F39200] hover:bg-[#E08200] text-slate-950 p-4 rounded-full shadow-2xl flex items-center justify-center border-2 border-white transition-all transform hover:scale-110 cursor-pointer group relative"
          title="Заказать обратный звонок"
        >
          <span className="absolute inset-0 rounded-full bg-[#F39200] opacity-40 animate-ping"></span>
          <PhoneCall className="w-6 h-6 relative z-10 text-slate-950" />
        </button>
      </div>

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
