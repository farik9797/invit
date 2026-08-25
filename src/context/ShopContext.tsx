import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, QuoteCartItem } from '../types';
import { PRODUCTS } from '../data/catalogData';
import { defaultVariant } from '../lib/product';

/**
 * Общее состояние магазина: корзина и модалки, которые нужны на любой странице.
 * Живёт над роутером, поэтому корзина не сбрасывается при переходах.
 *
 * Сама корзина — отдельная страница `/cart`, поэтому состояния «открыта/закрыта»
 * тут больше нет. Позиция опознаётся парой «товар + типоразмер»: один товар в
 * двух размерах — две строки заказа.
 *
 * Содержимое переживает перезагрузку: раз корзина стала страницей, на неё
 * заходят по прямой ссылке и обновляют её, а терять набранный заказ нельзя.
 * В хранилище кладём только id, типоразмер и количество — сам товар берём из
 * каталога, иначе в localStorage уедут описания и ссылки на картинки.
 *
 * Внутренние имена остались от «сметы КП» (quoteCart, addToQuote) — в интерфейсе
 * это корзина, переименование полей ничего бы не дало, кроме большого диффа.
 */
interface ShopContextValue {
  quoteCart: QuoteCartItem[];
  addToQuote: (product: Product, width?: string, qty?: number) => void;
  removeFromQuote: (key: string) => void;
  updateQuoteQty: (key: string, qty: number) => void;
  clearQuoteCart: () => void;

  isCallbackOpen: boolean;
  callbackNote: string;
  openCallback: (note?: string) => void;
  closeCallback: () => void;

  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const STORAGE_KEY = 'invit:cart:v1';

/** Читаем корзину из хранилища и достраиваем товары из каталога. */
const restoreCart = (): QuoteCartItem[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const rows: { id: string; width: string; qty: number }[] = JSON.parse(raw);

    return rows.flatMap((row) => {
      const product = PRODUCTS.find((p) => p.id === row.id);
      // Позиции могло не стать: каталог обновляется, а корзина лежит у покупателя
      if (!product) return [];

      return [
        {
          key: `${product.id}::${row.width}`,
          product,
          selectedWidth: row.width,
          quantity: Math.max(1, Math.round(row.qty) || 1)
        }
      ];
    });
  } catch {
    return [];
  }
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quoteCart, setQuoteCart] = useState<QuoteCartItem[]>(restoreCart);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [callbackNote, setCallbackNote] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          quoteCart.map((item) => ({
            id: item.product.id,
            width: item.selectedWidth,
            qty: item.quantity
          }))
        )
      );
    } catch {
      // Приватный режим или переполненное хранилище — корзина просто не переживёт
      // перезагрузку, но работать сайту это не мешает.
    }
  }, [quoteCart]);

  const addToQuote = (product: Product, width?: string, qty = 1) => {
    const selectedWidth = width || defaultVariant(product);
    const amount = Math.max(1, Math.round(qty));

    const key = `${product.id}::${selectedWidth}`;

    setQuoteCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.key === key);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + amount
        };
        return updated;
      }
      return [...prev, { key, product, selectedWidth, quantity: amount }];
    });
    // Никуда не переходим и ничего не открываем: обратная связь — счётчик у
    // иконки в шапке. За заказом покупатель идёт в корзину сам.
  };

  const value: ShopContextValue = {
    quoteCart,
    addToQuote,
    removeFromQuote: (key) => setQuoteCart((prev) => prev.filter((item) => item.key !== key)),
    updateQuoteQty: (key, qty) =>
      setQuoteCart((prev) =>
        prev.map((item) => (item.key === key ? { ...item, quantity: Math.max(1, qty) } : item))
      ),
    clearQuoteCart: () => setQuoteCart([]),

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
