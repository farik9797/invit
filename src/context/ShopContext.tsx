import React, { createContext, useContext, useState } from 'react';
import { Product, QuoteCartItem } from '../types';
import { defaultVariant } from '../lib/product';

/**
 * Общее состояние магазина: корзина и модалки, которые нужны на любой странице.
 * Живёт над роутером, поэтому корзина не сбрасывается при переходах.
 *
 * Внутренние имена остались от «сметы КП» (quoteCart, addToQuote) — в интерфейсе
 * это корзина, переименование полей ничего бы не дало, кроме большого диффа.
 */
interface ShopContextValue {
  quoteCart: QuoteCartItem[];
  addToQuote: (product: Product, width?: string, qty?: number) => void;
  removeFromQuote: (productId: string) => void;
  updateQuoteQty: (productId: string, qty: number) => void;
  clearQuoteCart: () => void;

  isQuoteCartOpen: boolean;
  openQuoteCart: () => void;
  closeQuoteCart: () => void;

  isCallbackOpen: boolean;
  callbackNote: string;
  openCallback: (note?: string) => void;
  closeCallback: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quoteCart, setQuoteCart] = useState<QuoteCartItem[]>([]);
  const [isQuoteCartOpen, setIsQuoteCartOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackNote, setCallbackNote] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const addToQuote = (product: Product, width?: string, qty = 1) => {
    const selectedWidth = width || defaultVariant(product);
    const amount = Math.max(1, Math.round(qty));

    setQuoteCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + amount
        };
        return updated;
      }
      return [...prev, { product, selectedWidth, quantity: amount }];
    });
    // Модалку намеренно не открываем: счётчик у иконки в шапке и подпись
    // «В корзине» на кнопке — достаточная обратная связь. Форма заказа живёт
    // внутри корзины, её открывает сам покупатель.
  };

  const value: ShopContextValue = {
    quoteCart,
    addToQuote,
    removeFromQuote: (productId) =>
      setQuoteCart((prev) => prev.filter((item) => item.product.id !== productId)),
    updateQuoteQty: (productId, qty) =>
      setQuoteCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
      ),
    clearQuoteCart: () => setQuoteCart([]),

    isQuoteCartOpen,
    openQuoteCart: () => setIsQuoteCartOpen(true),
    closeQuoteCart: () => setIsQuoteCartOpen(false),

    isCallbackOpen,
    callbackNote,
    openCallback: (note = '') => {
      setCallbackNote(note);
      setIsCallbackOpen(true);
    },
    closeCallback: () => setIsCallbackOpen(false),

    quickViewProduct,
    openQuickView: (product) => setQuickViewProduct(product),
    closeQuickView: () => setQuickViewProduct(null)
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop должен вызываться внутри ShopProvider');
  return ctx;
};
