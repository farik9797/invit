import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, ShoppingCart, Search, ChevronUp, MessageCircle } from 'lucide-react';
import invitLogo from '../../assets/logo/invit-color.svg';
import invitLight from '../../assets/logo/invit-light.svg';
import award2013 from '../../assets/awards/award-2013.webp';
import viberIcon from '../../assets/icons/viber.svg';
import whatsappIcon from '../../assets/icons/whatsapp.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import { paths } from '../../routes';
import { PRODUCTS } from '../../data/catalogData';
import { productImage } from '../../lib/productImages';
import { searchProducts } from '../../lib/search';
import { COMPANY, REQUISITES_COMPACT } from '../../data/company';
import { useShop } from '../../context/ShopContext';
import { gsap, MOTION_DURATION, MOTION_EASE, prefersReducedMotion } from './gsap';
import { MegaMenu, MOBILE_CATALOG_LINKS } from './MegaMenu';

/*
 * Обвязка второго варианта главной. Вариант живёт отдельным маршрутом и не
 * использует общий Layout, иначе зелёная шапка и подвал ломали бы палитру.
 *
 * Правило радиусов на всей странице: кнопки и поля 4px, карточки и фото 8px.
 * Другие значения не применяем.
 */

/**
 * Появление блока при прокрутке: GSAP ScrollTrigger, один раз на блок.
 * useLayoutEffect, а не useEffect, иначе стартовое состояние ставится после
 * первой отрисовки и блок успевает мигнуть.
 */
export const Fade: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATION,
          delay,
          ease: MOTION_EASE,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/**
 * Лесенка появления для сеток и списков: один ScrollTrigger на всю группу,
 * а не по одному на каждый элемент. Дети помечаются `data-fade-item`.
 */
export const FadeGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}> = ({ children, className, stagger = 0.06 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const items = el.querySelectorAll('[data-fade-item]');
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATION,
          ease: MOTION_EASE,
          stagger,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

/**
 * Число, которое досчитывается до своего значения, когда попадает в кадр.
 * Нужно, чтобы взгляд цеплялся за цифры: на них держится вся секция фактов.
 */
export const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    el.textContent = '0';
    const counter = { current: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        current: value,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = String(Math.round(counter.current));
        },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true }
      });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = String(value);
    };
  }, [value]);

  // Ширина зарезервирована под итоговое число, иначе строка дёргается при счёте
  return (
    <span ref={ref} className="inline-block tabular-nums" style={{ minWidth: `${String(value).length}ch` }}>
      {value}
    </span>
  );
};

/** «Каталог» вынесен в мега-меню, поэтому в текстовом меню шапки его нет. */
const NAV = [
  { label: 'Главная', to: paths.home },
  { label: 'О компании', to: paths.about },
  { label: 'Документация', to: paths.certificates },
  { label: 'Новости', to: paths.news },
  { label: 'Контакты', to: paths.contacts }
];

/** В подвале мега-меню нет, поэтому там перечисляем все разделы сайта. */
const FOOTER_NAV = [NAV[0], { label: 'Каталог', to: paths.catalog }, ...NAV.slice(1)];

const BLUE_BUTTON =
  'inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] bg-inv-blue text-white text-sm font-semibold whitespace-nowrap cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-blue-hover active:bg-inv-blue-pressed active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';

/**
 * Основная кнопка: синий из палитры клиента, белый текст, радиус 4px.
 * На главной варианта 2 ведёт якорем к форме, на остальных страницах формы
 * нет, поэтому там передаётся `onClick` и открывается модалка звонка.
 */
export const BlueButton: React.FC<{
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ href, onClick, children, className = '' }) =>
  onClick ? (
    <button type="button" onClick={onClick} className={`${BLUE_BUTTON} ${className}`}>
      {children}
    </button>
  ) : (
    <a href={href} className={`${BLUE_BUTTON} ${className}`}>
      {children}
    </a>
  );

/**
 * Иконка корзины со счётчиком. Добавление в корзину ничего не открывает —
 * покупатель видит, что счётчик вырос, и заходит сюда, когда собрал заказ.
 */
const CartButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const shop = useShop();
  const count = shop.quoteCart.length;

  return (
    <Link
      to={paths.cart}
      aria-label={count ? `Корзина, позиций: ${count}` : 'Корзина пуста'}
      className={`relative flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${className}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-inv-red text-white text-[11px] font-semibold leading-[18px] text-center tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
};

/**
 * Знак «Лучший строительный продукт года 2013» — закреплён у правого края,
 * чуть ниже центра (62% высоты окна): ровно по центру он попадал на строку с
 * заголовком раздела и закрывал счётчик документов на `/certificates`.
 *
 * Картинка вырезана из слайдера invit.by (отдельного файла у клиента нет):
 * круглая маска, увеличение втрое и лёгкая резкость, см. `scripts/award/`.
 *
 * Ведёт на страницу о самой награде — там текст конкурса и скан диплома.
 * Раньше знак был некликабельным: диплома на сайте не было, и клик уводил бы
 * в раздел, где его не найти.
 */
export const AwardBadge: React.FC<{ dimmed?: boolean }> = ({ dimmed }) => (
  <Link
    to={paths.bestProduct}
    aria-label="Лучший строительный продукт года 2013 — подробнее"
    aria-hidden={dimmed}
    tabIndex={dimmed ? -1 : undefined}
    style={{ clipPath: 'circle(50%)' }}
    className={`fixed right-2 md:right-4 xl:right-6 top-[35%] -translate-y-1/2 z-20 w-14 md:w-20 xl:w-24 transition-[transform,opacity] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inv-blue ${
      dimmed ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}
  >
    <img
      src={award2013}
      alt="Лучший строительный продукт года 2013"
      width={96}
      height={96}
      className="w-full h-auto select-none drop-shadow-[0_4px_14px_rgba(22,44,88,0.22)]"
    />
  </Link>
);

/** Подсказки под полем: проверено, что каждая что-то находит в каталоге. */
const SEARCH_HINTS = ['ПСУЛ', 'ПЭС', 'Герметики', 'Крепёж', 'Пена', 'Уголки'];

/**
 * Поиск в шапке: кнопка-лупа, по клику открывается попап.
 *
 * Своей выдачи попап не делает — уводит в каталог с готовым запросом
 * (`/catalog?q=…`), где поиск и фильтр по разделам уже есть.
 *
 * Полем прямо в строке шапки это было первой версией, но вместе с пятым
 * пунктом меню оно не помещалось: при окне 1024 строка распирала документ до
 * 1117px. Кнопка занимает 44px и помещается везде.
 */
/** Сколько совпадений показываем прямо в попапе — остальное на странице каталога. */
const SEARCH_PREVIEW_LIMIT = 6;

const plural = (n: number, forms: [string, string, string]) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];
  const mod10 = n % 10;
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
};

const HeaderSearch: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const matches = useMemo(() => searchProducts(PRODUCTS, value), [value]);
  const matchCount = value.trim() ? matches.length : 0;
  const results = matches.slice(0, SEARCH_PREVIEW_LIMIT);

  // Появление: сначала монтируем в свёрнутом виде, затем в следующем кадре
  // включаем классы перехода — иначе браузер отрисует сразу конечное состояние.
  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    const id = requestAnimationFrame(() => setShown(true));
    inputRef.current?.focus();
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);

    // Фон не должен уезжать под попапом
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const go = (query: string) => {
    const q = query.trim();
    navigate(q ? `${paths.catalog}?q=${encodeURIComponent(q)}` : paths.catalog);
    setValue('');
    setOpen(false);
  };

  const motion = prefersReducedMotion();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Поиск по каталогу"
        aria-expanded={open}
        className={`flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink hover:text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${className}`}
      >
        <Search className="w-5 h-5" />
      </button>

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] pb-8 overflow-y-auto bg-inv-deep/55 backdrop-blur-sm transition-opacity duration-[200ms] ${
            shown || motion ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Поиск по каталогу"
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[640px] rounded-[8px] bg-white shadow-[0_24px_60px_rgba(10,25,60,0.35)] transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              shown || motion ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть поиск"
              className="absolute top-2 right-2 flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink-muted hover:text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
            >
              <X className="w-5 h-5" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                go(value);
              }}
              role="search"
              className="px-5 pt-6 pb-5 sm:px-7 sm:pt-7"
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-inv-ink-muted">
                Поиск по каталогу
              </span>

              <span className="relative mt-4 block">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-inv-ink-muted" />
                <input
                  ref={inputRef}
                  type="search"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Лента, ПСУЛ, профиль, крепёж…"
                  aria-label="Что ищем"
                  className="w-full h-14 pl-12 pr-4 rounded-[4px] border border-inv-border bg-inv-surface-1 text-base sm:text-lg text-inv-ink placeholder:text-inv-ink-muted transition-[background-color,border-color] duration-[120ms] focus:bg-white focus:border-inv-blue focus-visible:outline-none"
                />
              </span>

              <button
                type="submit"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 min-h-11 h-12 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <Search className="w-4 h-4" />
                Найти в каталоге
              </button>
            </form>

            {/* Живая выдача: показываем первые совпадения прямо в попапе,
                чтобы за товаром не нужно было идти на страницу каталога. */}
            {value.trim() && (
              <div className="border-t border-inv-border-subtle max-h-[46vh] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-5 py-6 sm:px-7 text-sm text-inv-ink-muted">
                    По запросу «{value.trim()}» ничего не нашлось. Попробуйте короче или
                    введите артикул.
                  </p>
                ) : (
                  <ul>
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={paths.product(product)}
                          onClick={() => {
                            setValue('');
                            setOpen(false);
                          }}
                          className="flex items-center gap-3 px-5 sm:px-7 py-3 hover:bg-inv-surface-1 transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue"
                        >
                          <img
                            src={productImage(product)}
                            alt=""
                            aria-hidden
                            loading="lazy"
                            className="w-12 h-12 shrink-0 object-contain bg-white rounded-[4px] border border-inv-border-subtle p-1"
                          />
                          <span className="min-w-0">
                            <span className="block text-sm text-inv-ink leading-snug line-clamp-2">
                              {product.title}
                            </span>
                            {product.sku && (
                              <span className="mt-0.5 block text-xs text-inv-ink-muted">
                                Артикул {product.sku}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="px-5 pb-6 pt-4 sm:px-7 border-t border-inv-border-subtle">
              {!value.trim() && (
                <>
                  <span className="block text-xs text-inv-ink-muted">Часто ищут</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SEARCH_HINTS.map((hint) => (
                      <button
                        key={hint}
                        type="button"
                        onClick={() => setValue(hint)}
                        className="inline-flex items-center min-h-11 px-4 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                      >
                        {hint}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <p className={`text-xs text-inv-ink-muted ${value.trim() ? '' : 'mt-4 pt-4 border-t border-inv-border-subtle'}`}>
                {matchCount > 0
                  ? `Найдено ${matchCount} ${plural(matchCount, ['позиция', 'позиции', 'позиций'])} — Enter покажет все.`
                  : 'Ищем по названию и артикулу.'}{' '}
                Закрыть: <kbd className="px-1.5 py-0.5 rounded-[3px] border border-inv-border bg-inv-surface-1 font-sans">Esc</kbd>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Плавающие кнопки в правом нижнем углу: наверх, Viber, обратный звонок.
 *
 * «Наверх» появляется только после двух экранов прокрутки — на короткой
 * странице она бесполезна и просто занимает угол.
 *
 * Viber открывается по схеме `viber://chat`. Если приложение не установлено,
 * ничего не произойдёт: подстраховки через web-ссылку у Viber нет, поэтому
 * рядом остаётся кнопка обратного звонка.
 *
 * Знак «2013» висит выше, на 62% высоты окна, — эти кнопки его не задевают.
 */
/*
 * Раскрывающийся виджет каналов связи — по образцу стороннего плагина Chaty,
 * который клиент показал на сайте партнёра (otdelkahomes.by): круглая кнопка
 * снизу разворачивает стопку каналов вверх, повторный клик (или крестик)
 * сворачивает обратно.
 *
 * WhatsApp и Instagram у ИНВИТ пока нет ни на этом сайте, ни на реальном
 * invit.by — клиент попросил добавить кнопки уже сейчас и прислать ссылки
 * позже. `href="#"` с отменой перехода — временная заглушка, заменить на
 * `https://wa.me/...` и адрес профиля, когда придут номер и аккаунт.
 */
const CHANNELS: {
  key: string;
  label: string;
  href: string;
  isPlaceholder?: boolean;
  bg: string;
  icon: string;
}[] = [
  {
    key: 'whatsapp',
    label: 'Написать в WhatsApp',
    href: '#',
    isPlaceholder: true,
    bg: 'bg-[#25D366] hover:bg-[#20bd5a]',
    icon: whatsappIcon
  },
  {
    key: 'instagram',
    label: 'Открыть Instagram',
    href: '#',
    isPlaceholder: true,
    bg: 'hover:brightness-95',
    icon: instagramIcon
  },
  {
    key: 'viber',
    label: 'Написать в Viber',
    href: 'viber://chat?number=%2B375296444979',
    bg: 'bg-[#7360F2] hover:bg-[#5f4ce0]',
    icon: viberIcon
  }
];

const INSTAGRAM_GRADIENT = {
  backgroundImage: 'linear-gradient(45deg, #FEDA75, #FA7E1E, #D62976, #962FBF, #4F5BD5)'
};

export const FloatingActions: React.FC<{ expanded: boolean; onExpandedChange: (expanded: boolean) => void }> = ({
  expanded,
  onExpandedChange
}) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight * 2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const round =
    'w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_6px_24px_rgba(22,44,88,0.22)] flex items-center justify-center cursor-pointer transition-[background-color,transform,opacity] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.96]';

  return (
    <>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
          aria-label="Наверх"
          className={`${round} fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 bg-white border border-inv-border text-inv-ink hover:text-inv-blue hover:border-inv-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue`}
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center gap-3">
      {CHANNELS.map((channel, idx) => (
        <a
          key={channel.key}
          href={channel.href}
          target={channel.isPlaceholder ? undefined : '_blank'}
          rel={channel.isPlaceholder ? undefined : 'noopener'}
          onClick={channel.isPlaceholder ? (e) => e.preventDefault() : undefined}
          aria-label={channel.label}
          aria-hidden={!expanded}
          tabIndex={expanded ? 0 : -1}
          style={{
            transitionDelay: expanded ? `${idx * 30}ms` : '0ms',
            ...(channel.key === 'instagram' ? INSTAGRAM_GRADIENT : undefined)
          }}
          className={`${round} ${channel.bg} text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            expanded
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-75 translate-y-3 pointer-events-none'
          }`}
        >
          <img src={channel.icon} alt="" aria-hidden width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      ))}

      <a
        href={`tel:${COMPANY.phoneMinsk.replace(/[^\d+]/g, '')}`}
        aria-label="Позвонить"
        aria-hidden={!expanded}
        tabIndex={expanded ? 0 : -1}
        style={{ transitionDelay: expanded ? `${CHANNELS.length * 30}ms` : '0ms' }}
        className={`${round} bg-inv-blue hover:bg-inv-blue-hover text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
          expanded
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-75 translate-y-3 pointer-events-none'
        }`}
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      </a>

      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Закрыть контакты' : 'Связаться с нами'}
        className={`${round} bg-inv-blue hover:bg-inv-blue-hover text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue`}
      >
        {expanded ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>
      </div>
    </>
  );
};

export const HeaderV2: React.FC<{ onRequest?: () => void }> = ({ onRequest }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-inv-border">
      {/* Первая строка: логотип, телефон, поиск, корзина, «Запросить расчёт» */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        <Link
          to={paths.home}
          className="shrink-0 flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-8 w-auto" />
        </Link>

        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-auto">
          <HeaderSearch />

          <a
            href="tel:+375296444979"
            className="flex items-center gap-2 text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            +375 29 644-49-79
          </a>
          <CartButton />

          <BlueButton href="#zapros" onClick={onRequest}>
            Запросить расчёт
          </BlueButton>
        </div>

        {/* На узком экране корзина остаётся видимой, рядом с бургером */}
        <div className="flex items-center gap-1 lg:hidden">
          <HeaderSearch />
          <CartButton />

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="w-11 h-11 -mr-2 flex items-center justify-center text-inv-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </div>

      {/* Вторая строка: каталог и разделы сайта — в шапке из одной строки
          пятый пункт меню вместе с правым блоком не помещался. */}
      <div className="hidden lg:block border-t border-inv-border-subtle">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[52px] flex items-center gap-6">
          <MegaMenu />

          <nav className="flex items-center gap-6">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-sm text-inv-ink-muted hover:text-inv-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-inv-border bg-white px-4 py-4 space-y-1">
          <span className="block pt-1 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">
            Каталог товаров
          </span>
          {MOBILE_CATALOG_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center min-h-11 text-base font-semibold text-inv-ink"
            >
              {item.label}
            </Link>
          ))}

          <span className="block pt-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted">
            Разделы сайта
          </span>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center min-h-11 text-base text-inv-ink"
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="tel:+375296444979"
            className="flex items-center min-h-11 text-base font-semibold text-inv-ink"
          >
            +375 29 644-49-79
          </a>
          <BlueButton
            href="#zapros"
            onClick={onRequest && (() => { setOpen(false); onRequest(); })}
            className="w-full mt-2"
          >
            Запросить расчёт
          </BlueButton>
        </div>
      )}
    </header>
  );
};

export const FooterV2: React.FC = () => (
  <footer className="bg-inv-deep text-inv-on-deep">
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pr-20 sm:pr-4 lg:pr-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <div className="space-y-4">
        <Link
          to={paths.home}
          className="inline-flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <img src={invitLight} alt="ООО «ИНВИТ»" className="h-10 w-auto" />
        </Link>
        <p className="text-sm leading-relaxed max-w-xs">
          Белорусский производитель уплотнительных и герметизирующих лент EUROBAND.
          Сопутствующие материалы поставляем напрямую от производителей.
        </p>

        <div className="flex flex-col sm:gap-1">
          <a
            href="tel:+375296444979"
            className="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap"
          >
            {COMPANY.phoneMinsk}
            <span className="text-xs font-normal text-white/55">Минск</span>
          </a>
          <a
            href="tel:+375174325022"
            className="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap"
          >
            {COMPANY.phoneSoligorsk}
            <span className="text-xs font-normal text-white/55">Солигорск</span>
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]"
          >
            {COMPANY.email}
          </a>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <h2 className="text-white font-semibold">Разделы</h2>
        {/* На телефоне ссылки подвала тоже цель для пальца. Высоты 44px хватает
            и как разделителя, поэтому вертикальные отступы там убраны. */}
        <nav className="flex flex-col sm:gap-3">
          {FOOTER_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3 text-sm xl:pr-24">
        <h2 className="text-white font-semibold">Реквизиты</h2>

        {/* Четыре плотные строки: восемь пар «подпись — значение» вытягивали
            колонку вдвое длиннее соседних и ломали строй подвала. Полный
            список с подписями остался на странице «О компании». */}
        <ul className="space-y-2 text-[13px] leading-[1.5] text-white/70">
          {REQUISITES_COMPACT.map((line) => (
            <li key={line} className="break-words">
              {line}
            </li>
          ))}
        </ul>

        <Link
          to={paths.about}
          className="inline-flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]"
        >
          Все реквизиты и документы
        </Link>
      </div>
    </div>

    <div className="border-t border-white/15">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pr-20 sm:pr-24 lg:pr-28 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6">
        <span>© 2001-2026 ООО «ИНВИТ». Все права защищены.</span>
        <Link
          to={paths.privacy}
          className="inline-flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms] whitespace-nowrap"
        >
          Политика конфиденциальности
        </Link>
      </div>
    </div>
  </footer>
);
