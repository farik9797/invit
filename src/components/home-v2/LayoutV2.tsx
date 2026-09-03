import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderV2, FooterV2, AwardBadge, FloatingActions } from './Chrome';
import { ProductDetailModal } from '../Modals/ProductDetailModal';
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
  // Медаль «Лучший продукт 2013» и раскрытый виджет контактов делят одно
  // и то же место на телефонах — прячем медаль, пока виджет открыт.
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <div className="theme-v2 font-v2 min-h-screen flex flex-col bg-white text-inv-ink antialiased selection:bg-inv-blue selection:text-white">
      <HeaderV2 onRequest={() => shop.openCallback('Запрос из шапки')} />

      <main className="flex-1">
        <Outlet />
      </main>

      <FooterV2 />

      <AwardBadge dimmed={contactsOpen} />

      <FloatingActions expanded={contactsOpen} onExpandedChange={setContactsOpen} />

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

      <CallbackModal
        isOpen={shop.isCallbackOpen}
        onClose={shop.closeCallback}
        customNote={shop.callbackNote}
      />
    </div>
  );
};
