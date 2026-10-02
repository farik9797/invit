import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Send, CheckCircle2, ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useShop } from '../context/ShopContext';
import { productImage } from '../lib/productImages';
import { productUnit } from '../lib/unit';
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

/*
 * Заявка на счёт, а не заказ в магазине: клиент работает только с юрлицами и
 * ИП, поэтому форма спрашивает реквизиты (организация, УНП, контактное лицо),
 * а отправка закрыта подтверждением статуса покупателя. Без этой галочки
 * кнопка не работает — так заявка не превращается в розничную покупку.
 */
interface Errors {
  companyName?: string;
  unp?: string;
  person?: string;
  email?: string;
  phone?: string;
}

/** Почта на вид: имя, собака, домен с точкой. Глубже проверит отправка. */
const MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD =
  'w-full min-h-11 px-3 bg-white border rounded-[4px] text-sm text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';

const LABEL = 'block text-xs font-semibold text-inv-ink mb-1.5';

/** Сообщение под полем: одинаковое во всей форме. */
const Hint: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-inv-error">
    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
    {children}
  </p>
);

export const CartPage: React.FC = () => {
  const shop = useShop();
  const items = shop.quoteCart;

  const [companyName, setCompanyName] = useState('');
  const [unp, setUnp] = useState('');
  const [person, setPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const total = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!companyName.trim()) next.companyName = 'Укажите организацию или ИП';
    if (!/^\d{9}$/.test(unp.trim())) next.unp = 'УНП — ровно девять цифр';
    if (!person.trim()) next.person = 'Укажите, с кем связаться';
    if (!MAIL.test(email.trim())) next.email = 'Счёт придёт на этот адрес — проверьте его';
    if (phone.replace(/\D/g, '').length < 9) next.phone = 'Введите номер телефона полностью';
    setErrors(next);
    if (Object.keys(next).length || !agree) return;
    setSubmitted(true);
    shop.clearQuoteCart();
  };

  if (submitted) {
    return (
      <section className="bg-white">
        <div className="max-w-[1340px] mx-auto px-5 py-20 sm:py-28 text-center">
          <CheckCircle2 className="w-14 h-14 text-inv-blue mx-auto" />
          <h1 className="mt-5 text-2xl sm:text-3xl font-semibold text-inv-ink">
            Заявка на получение счёта успешно отправлена
          </h1>
          <p className="mt-4 text-sm sm:text-base text-inv-ink-muted leading-relaxed max-w-xl mx-auto">
            Наши менеджеры уже проверяют наличие товара на складе и корректность
            указанного УНП. Счёт-фактура для безналичного расчёта будет выслан на ваш
            Email в течение 30 минут (в рабочее время).
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
              ? `${items.length} ${plural(items.length)}, всего ${total} ед.`
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
                  {items.map(({ key, product, variant, quantity }) => (
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
                        {variant && (
                          <div className="text-xs text-inv-ink-muted mt-1">
                            {product.variantLabel ?? 'Исполнение'}: {variant}
                          </div>
                        )}
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

                      {/* Единица своя у каждой позиции: крепёж отгружают коробами */}
                      <span className="text-xs text-inv-ink-muted whitespace-nowrap">
                        {productUnit(product).short}
                      </span>

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
                className="lg:col-span-5 xl:col-span-4 rounded-[8px] border border-inv-border bg-inv-surface-1 p-5 sm:p-6 space-y-4"
              >
                <h2 className="text-lg font-semibold text-inv-ink">Заявка на счёт-фактуру</h2>

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

                {/* Реквизиты запрашиваем те, без которых счёт не выписать. */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label htmlFor="zayavka-org" className={LABEL}>
                      Наименование организации / ИП <span className="text-inv-error">*</span>
                    </label>
                    <input
                      id="zayavka-org"
                      type="text"
                      placeholder="ООО «Вектор» или ИП Иванов И. И."
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      aria-invalid={Boolean(errors.companyName)}
                      className={`${FIELD} ${errors.companyName ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.companyName && <Hint>{errors.companyName}</Hint>}
                  </div>

                  <div>
                    <label htmlFor="zayavka-unp" className={LABEL}>
                      УНП <span className="text-inv-error">*</span>
                    </label>
                    <input
                      id="zayavka-unp"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="9 цифр"
                      value={unp}
                      onChange={(e) => setUnp(e.target.value.replace(/\D/g, ''))}
                      aria-invalid={Boolean(errors.unp)}
                      className={`${FIELD} tabular-nums ${errors.unp ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.unp && <Hint>{errors.unp}</Hint>}
                  </div>

                  <div>
                    <label htmlFor="zayavka-person" className={LABEL}>
                      Контактное лицо (ФИО) <span className="text-inv-error">*</span>
                    </label>
                    <input
                      id="zayavka-person"
                      type="text"
                      placeholder="Иванов Иван Иванович"
                      value={person}
                      onChange={(e) => setPerson(e.target.value)}
                      aria-invalid={Boolean(errors.person)}
                      className={`${FIELD} ${errors.person ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.person && <Hint>{errors.person}</Hint>}
                  </div>

                  <div>
                    <label htmlFor="zayavka-email" className={LABEL}>
                      Email для отправки счёта <span className="text-inv-error">*</span>
                    </label>
                    <input
                      id="zayavka-email"
                      type="email"
                      inputMode="email"
                      placeholder="buh@company.by"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      className={`${FIELD} ${errors.email ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.email && <Hint>{errors.email}</Hint>}
                  </div>

                  <div>
                    <label htmlFor="zayavka-phone" className={LABEL}>
                      Номер телефона <span className="text-inv-error">*</span>
                    </label>
                    <input
                      id="zayavka-phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+375 29 000-00-00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      className={`${FIELD} ${errors.phone ? 'border-inv-error' : 'border-inv-border'}`}
                    />
                    {errors.phone && <Hint>{errors.phone}</Hint>}
                  </div>

                  <div>
                    <label htmlFor="zayavka-address" className={LABEL}>
                      Юридический адрес
                    </label>
                    <input
                      id="zayavka-address"
                      type="text"
                      placeholder="Необязательно"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`${FIELD} border-inv-border`}
                    />
                  </div>

                  <div>
                    <label htmlFor="zayavka-note" className={LABEL}>
                      Комментарий к заявке
                    </label>
                    <textarea
                      id="zayavka-note"
                      rows={3}
                      placeholder="Сроки, доставка, нетиповые размеры"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={`${FIELD} border-inv-border py-2.5 resize-y`}
                    />
                  </div>
                </div>

                {/* Оговорка стоит перед кнопкой: её читают там, где принимают
                    решение отправить, а не в подвале страницы. */}
                <div className="rounded-[4px] border border-inv-border bg-white p-4">
                  <p className="text-xs font-semibold text-inv-ink">
                    Важная информация для клиентов
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-inv-ink-muted">
                    Сайт носит исключительно информационный характер, не является
                    интернет-магазином и публичной офертой. Продажа товаров физическим
                    лицам (розничная торговля) не осуществляется.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-inv-ink-muted">
                    Оформляя данную заявку, вы подтверждаете, что являетесь юридическим
                    лицом или индивидуальным предпринимателем. На основании
                    предоставленных данных вам будет сформирован и выслан счёт-фактура
                    для безналичной оплаты.
                  </p>
                </div>

                <label className="flex gap-2.5 items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-inv-blue cursor-pointer"
                  />
                  <span className="text-xs leading-relaxed text-inv-ink">
                    Я подтверждаю, что оформляю заказ от имени юридического лица (ИП), и
                    даю согласие на обработку персональных данных в целях формирования
                    индивидуального счёта-фактуры.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!agree}
                  className="w-full inline-flex items-center justify-center gap-2 min-h-11 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer disabled:bg-inv-border disabled:text-inv-ink-muted disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  <Send className="w-4 h-4" />
                  Получить счёт-фактуру
                </button>

                <p className="text-xs text-inv-ink-muted leading-relaxed">
                  Нужные размеры и объём напишите в комментарии — менеджер посчитает и
                  пришлёт счёт. Нетиповые размеры считаем отдельно.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
