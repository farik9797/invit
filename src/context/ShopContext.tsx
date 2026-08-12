import React, { createContext, useContext, useState } from 'react';
import { Product, QuoteCartItem } from '../types';

/**
 * Общее состояние магазина: смета КП и модалки, которые нужны на любой странице.
 * Живёт над роутером, поэтому корзина не сбрасывается при переходах.
 */
interface ShopContextValue {
  quoteCart: QuoteCartItem[];
  addToQuote: (product: Product, width?: string) => void;
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

  const addToQuote = (product: Product, width?: string) => {
    const selectedWidth = width || product.specs.width || '70 мм';
    setQuoteCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      }
      return [...prev, { product, selectedWidth, quantity: 10 }];
    });
    setIsQuoteCartOpen(true);
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
