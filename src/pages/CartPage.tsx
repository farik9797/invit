import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Send, CheckCircle2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShop } from '../context/ShopContext';
import { productImage } from '../lib/productImages';
import { paths } from '../routes';

/*
 * Корзина отдельной страницей: раньше была модалкой, но заказ из нескольких
 * позиций в окне поверх каталога собирать неудобно — не видно, что уже набрано.
 *
 * Цен не показываем: их нет в каталоге, объём считает менеджер.
 */

const plural = (n: number) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'позиций';
  const mod10 = n % 10;
  if (mod10 === 1) return 'позиция';
  if (mod10 >= 2 && mod10 <= 4) return 'позиции';
  return 'позиций';
};

export const CartPage: React.FC = () => {
  const shop = useShop();
  const items = shop.quoteCart;

  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
    shop.clearQuoteCart();
  };

  if (submitted) {
    return (
      <section className="bg-white">
        <div className="max-w-[1340px] mx-auto px-5 py-20 sm:py-28 text-center">
          <CheckCircle2 className="w-14 h-14 text-inv-blue mx-auto" />
          <h1 className="mt-5 text-2xl sm:text-3xl font-semibold text-inv-ink">
            Заявка отправлена
          </h1>
          <p className="mt-4 text-sm sm:text-base text-inv-ink-muted leading-relaxed max-w-md mx-auto">
            Менеджер ООО «ИНВИТ» посчитает объём и цены и свяжется с вами по указанному
            телефону.
          </p>
          <Link
            to={paths.catalog}
            className="inline-flex items-center gap-2 min-h-11 px-6 mt-8 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
          >
            <ArrowLeft className="w-4 h-4" />
            Вернуться в каталог
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Корзина' }]} />

      <section className="bg-inv-deep text-white">
        <div className="max-w-[1340px] mx-auto px-5 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            Корзина
          </h1>
          <p className="mt-3 text-sm sm:text-base text-white/70">
            {items.length > 0
              ? `${items.length} ${plural(items.length)}, всего ${total} шт.`
              : 'Здесь появятся позиции, которые вы отметите в каталоге.'}
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1340px] mx-auto px-5 py-8 sm:py-12">
          {items.length === 0 ? (
            <div className="py-16 text-center rounded-[8px] border border-inv-border bg-inv-surface-1">
              <ShoppingCart className="w-12 h-12 text-inv-ink-muted/50 mx-auto" />
              <h2 className="mt-4 text-base font-semibold text-inv-ink">Корзина пока пуста</h2>
              <p className="mt-2 text-sm text-inv-ink-muted max-w-sm mx-auto leading-relaxed">
                Нажмите «В корзину» в каталоге, чтобы собрать список нужных материалов.
                Нужные размеры и объём укажите в комментарии к заявке.
              </p>
              <Link
                to={paths.catalog}
                className="inline-flex items-center gap-2 min-h-11 px-6 mt-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
              {/* Позиции */}
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                  {items.map(({ key, product, quantity }) => (
                    <div key={key} className="p-4 flex flex-wrap sm:flex-nowrap items-center gap-4">
                      <Link
                        to={paths.product(product)}
                        className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                      >
                        <img
                          src={productImage(product)}
                          alt={product.title}
                          loading="lazy"
                          className="w-20 h-20 sm:w-24 sm:h-24 object-contain bg-white rounded-[4px] border border-inv-border-subtle p-1.5"
                        />
                      </Link>

                      <div className="flex-1 min-w-[160px]">
                        <Link
                          to={paths.product(product)}
                          className="inline-block min-h-11 sm:min-h-0 text-sm font-semibold text-inv-ink leading-snug hover:text-inv-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                        >
                          {product.title}
                        </Link>
                      </div>

                      <div className="flex items-center rounded-[4px] border border-inv-border overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => shop.updateQuoteQty(key, quantity - 1)}
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
                            shop.updateQuoteQty(key, Math.round(Number(e.target.value) || 1))
                          }
                          aria-label={`Количество: ${product.title}`}
                          className="w-14 h-11 text-center text-sm font-semibold text-inv-ink border-x border-inv-border tabular-nums focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue"
                        />
                        <button
                          type="button"
                          onClick={() => shop.updateQuoteQty(key, quantity + 1)}
                          aria-label={`Прибавить: ${product.title}`}
                          className="flex items-center justify-center w-11 h-11 text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => shop.removeFromQuote(key)}
                        aria-label={`Убрать: ${product.title}`}
                        className="flex items-center justify-center w-11 h-11 shrink-0 rounded-[4px] text-inv-ink-muted hover:text-inv-red hover:bg-inv-surface-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={paths.catalog}
                    className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Продолжить выбор
                  </Link>

                  {confirmClear ? (
                    <span className="flex items-center gap-2 text-sm">
                      <span className="text-inv-ink-muted">Удалить все позиции?</span>
                      <button
                        type="button"
                        onClick={() => {
                          shop.clearQuoteCart();
                          setConfirmClear(false);
                        }}
                        className="inline-flex items-center min-h-11 px-4 rounded-[4px] bg-inv-red hover:brightness-95 text-white font-semibold transition-[filter] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-red"
                      >
                        Да, удалить
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="inline-flex items-center min-h-11 px-3 text-inv-ink-muted hover:text-inv-ink transition-colors cursor-pointer"
                      >
                        Отмена
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="inline-flex items-center gap-2 min-h-11 px-4 rounded-[4px] border border-inv-border text-sm font-semibold text-inv-ink-muted hover:text-inv-red hover:border-inv-red transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-red"
                    >
                      <Trash2 className="w-4 h-4" />
                      Очистить корзину
                    </button>
                  )}
                </div>
              </div>

              {/* Заказ */}
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 sm:p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-inv-ink">Оформить заявку</h2>

                <dl className="text-sm space-y-1.5">
                  <div className="flex justify-between gap-4">
                    <dt className="text-inv-ink-muted">Позиций</dt>
                    <dd className="font-semibold text-inv-ink tabular-nums">{items.length}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-inv-ink-muted">Всего единиц</dt>
                    <dd className="font-semibold text-inv-ink tabular-nums">{total}</dd>
                  </div>
                </dl>

                <div className="space-y-3 pt-1">
                  <input
                    type="text"
                    placeholder="Компания или ИП"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full min-h-11 px-3 bg-white border border-inv-border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Телефон *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full min-h-11 px-3 bg-white border border-inv-border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                  <textarea
                    rows={3}
                    placeholder="Комментарий: сроки, доставка, нетиповые размеры"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-inv-border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted resize-y focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  <Send className="w-4 h-4" />
                  Отправить заявку
                </button>

                <p className="text-xs text-inv-ink-muted leading-relaxed">
                  Нужные размеры и объём напишите в комментарии — менеджер посчитает и
                  пришлёт предложение. Нетиповые размеры считаем отдельно.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
