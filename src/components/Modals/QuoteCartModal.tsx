import React, { useState } from 'react';
import { X, Trash2, Send, CheckCircle2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { QuoteCartItem } from '../../types';
import { productImage } from '../../lib/productImages';

/*
 * Корзина. Раньше называлась «сметой КП», клиент попросил обычную корзину:
 * добавляем сколько нужно, количество правится прямо здесь.
 *
 * Цены не показываем — их нет в каталоге, менеджер считает по объёму.
 */

interface QuoteCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteCartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
}

const plural = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'позиций';
  const mod10 = n % 10;
  if (mod10 === 1) return 'позиция';
  if (mod10 >= 2 && mod10 <= 4) return 'позиции';
  return 'позиций';
};

export const QuoteCartModal: React.FC<QuoteCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart
}) => {
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inv-deep/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-[8px] max-w-2xl w-full shadow-[0_6px_24px_rgba(22,44,88,0.24)] border border-inv-border overflow-hidden my-8">
        <div className="bg-inv-blue text-white px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-semibold text-sm sm:text-base">
            <ShoppingCart className="w-5 h-5" />
            Корзина
            {items.length > 0 && (
              <span className="text-white/75 font-normal">
                — {items.length} {plural(items.length)}
              </span>
            )}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть корзину"
            className="flex items-center justify-center w-11 h-11 -mr-2 rounded-[4px] hover:bg-white/15 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-inv-blue mx-auto" />
              <h3 className="text-xl font-semibold text-inv-ink">Заявка отправлена</h3>
              <p className="text-sm text-inv-ink-muted max-w-md mx-auto leading-relaxed">
                Менеджер ООО «ИНВИТ» посчитает объём и цены и свяжется с вами по
                указанному телефону.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClearCart();
                  setSubmitted(false);
                  onClose();
                }}
                className="inline-flex items-center min-h-11 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-inv-ink-muted/50 mx-auto" />
              <h3 className="text-base font-semibold text-inv-ink">Корзина пока пуста</h3>
              <p className="text-sm text-inv-ink-muted max-w-xs mx-auto leading-relaxed">
                Нажмите «В корзину» в каталоге, чтобы собрать список нужных материалов.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                {items.map(({ product, selectedWidth, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3 sm:p-4 flex items-center gap-3 hover:bg-inv-surface-1 transition-colors"
                  >
                    <img
                      src={productImage(product)}
                      alt={product.title}
                      loading="lazy"
                      className="w-14 h-14 shrink-0 object-contain bg-white rounded-[4px] border border-inv-border-subtle p-1"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-inv-ink leading-snug line-clamp-2">
                        {product.title}
                      </h4>
                      <span className="mt-0.5 block text-xs text-inv-ink-muted">
                        Типоразмер: {selectedWidth}
                      </span>
                    </div>

                    <div className="flex items-center rounded-[4px] border border-inv-border overflow-hidden shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                        aria-label={`Убавить: ${product.title}`}
                        disabled={quantity <= 1}
                        className="flex items-center justify-center w-11 h-11 text-inv-ink hover:bg-inv-surface-1 disabled:opacity-40 disabled:cursor-default transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) =>
                          onUpdateQuantity(product.id, Math.max(1, Math.round(Number(e.target.value) || 1)))
                        }
                        aria-label={`Количество: ${product.title}`}
                        className="w-12 h-11 text-center text-sm font-semibold text-inv-ink border-x border-inv-border tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        aria-label={`Прибавить: ${product.title}`}
                        className="flex items-center justify-center w-11 h-11 text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(product.id)}
                      aria-label={`Убрать из корзины: ${product.title}`}
                      className="flex items-center justify-center w-11 h-11 shrink-0 rounded-[4px] text-inv-ink-muted hover:text-inv-red hover:bg-inv-surface-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-inv-ink-muted">
                  Всего <span className="font-semibold text-inv-ink tabular-nums">{total}</span> шт.
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="inline-flex items-center min-h-11 text-inv-ink-muted hover:text-inv-red transition-colors cursor-pointer"
                >
                  Очистить корзину
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-3 bg-inv-surface-1 p-4 rounded-[8px] border border-inv-border"
              >
                <h4 className="text-sm font-semibold text-inv-ink">Куда прислать расчёт</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Компания или ИП"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="min-h-11 px-3 bg-white border border-inv-border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Телефон *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="min-h-11 px-3 bg-white border border-inv-border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Отправить заявку
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
