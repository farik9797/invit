import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import invitLogo from '../../assets/logo/invit-color.svg';
import award2013 from '../../assets/awards/award-2013.webp';
import { paths } from '../../routes';
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
  { label: 'О компании', to: paths.about },
  { label: 'Документация', to: paths.certificates },
  { label: 'Новости', to: paths.news },
  { label: 'Контакты', to: paths.contacts }
];

/** В подвале мега-меню нет, поэтому там перечисляем все разделы сайта. */
const FOOTER_NAV = [
  { label: 'Главная', to: paths.home },
  { label: 'Каталог', to: paths.catalog },
  ...NAV
];

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
 * по центру по вертикали.
 *
 * Картинка вырезана из слайдера invit.by (отдельного файла у клиента нет):
 * круглая маска, увеличение втрое и лёгкая резкость, см. `scripts/award/`.
 *
 * Ссылки нет намеренно: самого диплома среди документов на сайте пока нет,
 * и клик уводил бы в раздел, где его не найти. Клики он не перехватывает
 * (`pointer-events-none`), поэтому на телефоне не мешает нажимать под собой.
 */
export const AwardBadge: React.FC = () => (
  <img
    src={award2013}
    alt="Лучший строительный продукт года 2013"
    width={96}
    height={96}
    className="fixed right-2 md:right-4 xl:right-6 top-1/2 -translate-y-1/2 z-20 w-14 md:w-20 xl:w-24 h-auto pointer-events-none select-none drop-shadow-[0_4px_14px_rgba(22,44,88,0.22)]"
  />
);

export const HeaderV2: React.FC<{ onRequest?: () => void }> = ({ onRequest }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-inv-border">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        <Link
          to={paths.home}
          className="shrink-0 flex items-center min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-8 w-auto" />
        </Link>

        <MegaMenu />

        <nav className="hidden lg:flex items-center gap-6">
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

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <a
            href="tel:+375296444979"
            className="hidden xl:flex items-center gap-2 text-sm font-semibold text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] whitespace-nowrap"
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
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
      <div className="space-y-4">
        <Link to={paths.home} className="inline-flex items-center min-h-11">
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-8 w-auto" />
        </Link>
        <p className="text-sm leading-relaxed max-w-xs">
          Белорусский производитель уплотнительных и герметизирующих лент EUROBAND.
          Сопутствующие материалы поставляем напрямую от производителей.
        </p>
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

      <div className="space-y-3 text-sm">
        <h2 className="text-white font-semibold">Реквизиты</h2>
        <p>УНП 192436058</p>
        <p>г. Минск, ул. Мясникова, 78, оф. 6</p>
        <div className="flex flex-col sm:gap-3">
          <a
            href="mailto:info@invit.by"
            className="flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors"
          >
            info@invit.by
          </a>
          <a
            href="tel:+375296444979"
            className="flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors"
          >
            +375 29 644-49-79
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-white/15">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 text-sm">
        <span>© 2009-2026 ООО «ИНВИТ». Все права защищены.</span>
      </div>
    </div>
  </footer>
);
