import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';
import { HeaderV2, FooterV2 } from './Chrome';
import { ProductDetailModal } from '../Modals/ProductDetailModal';
import { QuoteCartModal } from '../Modals/QuoteCartModal';
import { CallbackModal } from '../Modals/CallbackModal';
import { useShop } from '../../context/ShopContext';

/**
 * Обвязка каталога в цветах клиента: шапка с мега-меню и подвал из варианта 2,
 * а страницы каталога остаются прежними — их перекрашивает класс `theme-v2`,
 * который подменяет переменные бренда (см. `src/index.css`).
 */
export const LayoutV2: React.FC = () => {
  const shop = useShop();
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="theme-v2 font-v2 min-h-screen flex flex-col bg-white text-inv-ink antialiased selection:bg-inv-blue selection:text-white">
      <HeaderV2 />

      <main className="flex-1">
        <Outlet />
      </main>

      <FooterV2 />

      <button
        onClick={() => shop.openCallback('Запрос из каталога')}
        aria-label="Заказать обратный звонок"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-inv-blue hover:bg-inv-blue-hover text-white shadow-[0_6px_24px_rgba(22,44,88,0.16)] flex items-center justify-center cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
      >
        <PhoneCall className="w-6 h-6" />
      </button>

      {/* Модалки те же, что и на основном сайте: внутри этого блока они синие */}
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
