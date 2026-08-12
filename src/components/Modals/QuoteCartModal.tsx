import React, { useState } from 'react';
import { X, Trash2, Send, CheckCircle2, ShoppingBag, FileSpreadsheet } from 'lucide-react';
import { QuoteCartItem } from '../../types';

interface QuoteCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteCartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, qty: number) => void;
  onClearCart: () => void;
}

export const QuoteCartModal: React.FC<QuoteCartModalProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
              Смета Коммерческого Предложения ({items.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">
                Смета КП успешно отправлена в отдел продаж!
              </h3>
              <p className="text-slate-600 text-xs max-w-md mx-auto">
                Менеджер ООО «ИНВИТ» подготовит дифференцированный оптовый расчет и вышлет его на указный телефон в ближайшее время.
              </p>
              <button
                onClick={() => {
                  onClearCart();
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-brand-blue text-white font-bold text-xs uppercase px-6 py-2.5 rounded-lg"
              >
                Очистить и закрыть
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">
                Ваша смета пока пуста
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Нажмите «В прайс КП» в карточках каталога, чтобы сформировать список нужных материалов.
              </p>
            </div>
          ) : (
            <>
              {/* Selected Items List */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {items.map(({ product, selectedWidth, quantity }) => (
                  <div key={product.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 text-xs">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] text-slate-400 block font-bold">
                        {product.code}
                      </span>
                      <h4 className="font-bold text-slate-900 truncate">
                        {product.title}
                      </h4>
                      <span className="text-brand-blue text-[11px] font-semibold">
                        Ширина: {selectedWidth}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => onUpdateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 p-1.5 text-center font-bold border border-slate-300 rounded text-xs"
                      />
                      <span className="text-[10px] text-slate-400 font-semibold">рул/шт</span>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Удалить из сметы"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmitQuote} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <h4 className="font-extrabold text-slate-900 uppercase">
                  Контактные данные для получения расчета:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Компания / ИП"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Телефон для связи *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-black py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить смету на расчет за 15 минут</span>
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
