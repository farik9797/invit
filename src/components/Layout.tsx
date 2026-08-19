import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PhoneCall, ShoppingBag, ChevronUp } from 'lucide-react';
import { TopBar } from './TopBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ProductDetailModal } from './Modals/ProductDetailModal';
import { QuoteCartModal } from './Modals/QuoteCartModal';
import { CallbackModal } from './Modals/CallbackModal';
import { useShop } from '../context/ShopContext';

/** Прокрутка страницы наверх при переходе по маршруту. */
const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const Layout: React.FC = () => {
  const shop = useShop();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-surface-soft text-brand-navy font-sans antialiased selection:bg-brand-blue selection:text-white flex flex-col">
      <ScrollToTopOnNavigate />

      <TopBar />
      <Header
        onOpenCallback={() => shop.openCallback()}
        onOpenQuoteCart={shop.openQuoteCart}
        quoteCount={shop.quoteCart.length}
        onSelectProduct={shop.openQuickView}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer onOpenCallback={() => shop.openCallback()} />

      {/* Плавающие кнопки: наверх / смета / обратный звонок */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto bg-brand-navy hover:bg-brand-navy/90 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center border-2 border-white/80 transition-all transform hover:scale-110 cursor-pointer group backdrop-blur"
            title="Наверх"
            aria-label="Наверх"
          >
            <ChevronUp className="w-5 h-5 text-brand-red-light group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {shop.quoteCart.length > 0 && (
          <button
            onClick={shop.openQuoteCart}
            className="pointer-events-auto bg-brand-blue hover:bg-brand-blue-hover text-white p-3.5 rounded-full shadow-lg flex items-center gap-2 border-2 border-white transition-all transform hover:scale-105 cursor-pointer group"
            title="Открыть смету КП"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="absolute -top-2 -right-2 bg-brand-red text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {shop.quoteCart.length}
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline pr-1">
              Смета КП ({shop.quoteCart.length})
            </span>
          </button>
        )}

        <button
          onClick={() => shop.openCallback('Быстрый звонок с плавающей кнопки')}
          className="pointer-events-auto bg-brand-red hover:bg-brand-red-hover text-white p-4 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-all transform hover:scale-110 cursor-pointer group relative"
          title="Заказать обратный звонок"
        >
          <span className="absolute inset-0 rounded-full bg-brand-red opacity-40 animate-ping"></span>
          <PhoneCall className="w-6 h-6 relative z-10 text-white" />
        </button>
      </div>

      {/* Модалки, доступные с любой страницы */}
      <ProductDetailModal
        product={shop.quickViewProduct}
        onClose={shop.closeQuickView}
        onAddToQuote={shop.addToQuote}
        isAdded={
          shop.quickViewProduct
            ? shop.quoteCart.some((i) => i.product.id === shop.quickViewProduct!.id)
            : false
        }
      />

      <QuoteCartModal
        isOpen={shop.isQuoteCartOpen}
        onClose={shop.closeQuoteCart}
        items={shop.quoteCart}
        onRemoveItem={shop.removeFromQuote}
        onUpdateQuantity={shop.updateQuoteQty}
        onClearCart={shop.clearQuoteCart}
      />

      <CallbackModal
        isOpen={shop.isCallbackOpen}
        onClose={shop.closeCallback}
        customNote={shop.callbackNote}
      />
    </div>
  );
};
