import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import invitLogo from '../../assets/logo/invit-color.svg';
import invitLogoMono from '../../assets/logo/invit-mono.svg';
import { paths } from '../../routes';

/*
 * Обвязка второго варианта главной. Вариант живёт отдельным маршрутом и не
 * использует общий Layout, иначе зелёная шапка и подвал ломали бы палитру.
 *
 * Правило радиусов на всей странице: кнопки и поля 4px, карточки и фото 8px.
 * Другие значения не применяем.
 */

/** Появление блока при прокрутке. Тайминг Amex: 240 мс, cubic-bezier(0.4,0,0.2,1). */
export const Fade: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.24, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

const NAV = [
  { label: 'Каталог', to: paths.catalog },
  { label: 'О компании', to: paths.about },
  { label: 'Документация', to: paths.certificates },
  { label: 'Новости', to: paths.news },
  { label: 'Контакты', to: paths.contacts }
];

/** Синяя кнопка Amex: заливка #006FCF, белый текст, радиус 4px. */
export const BlueButton: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className = '' }) => (
  <a
    href={href}
    className={`inline-flex items-center justify-center min-h-11 px-6 rounded-[4px] bg-amex-blue text-white text-sm font-semibold whitespace-nowrap transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-amex-blue-hover active:bg-amex-blue-pressed active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amex-blue ${className}`}
  >
    {children}
  </a>
);

export const HeaderV2: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-amex-border">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        <Link
          to="/v2"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amex-blue"
        >
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-sm text-amex-ink-muted hover:text-amex-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amex-blue"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-5 shrink-0">
          <a
            href="tel:+375296444979"
            className="flex items-center gap-2 text-sm font-semibold text-amex-ink hover:text-amex-blue transition-colors duration-[120ms] whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            +375 29 644-49-79
          </a>
          <BlueButton href="#zapros">Запросить расчёт</BlueButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="lg:hidden w-11 h-11 -mr-2 flex items-center justify-center text-amex-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amex-blue"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-amex-border bg-white px-4 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center min-h-11 text-base text-amex-ink"
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="tel:+375296444979"
            className="flex items-center min-h-11 text-base font-semibold text-amex-ink"
          >
            +375 29 644-49-79
          </a>
          <BlueButton href="#zapros" className="w-full mt-2">
            Запросить расчёт
          </BlueButton>
        </div>
      )}
    </header>
  );
};

export const FooterV2: React.FC = () => (
  <footer className="bg-amex-navy text-amex-on-navy">
    <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-4">
        <img
          src={invitLogoMono}
          alt="ООО «ИНВИТ»"
          className="h-8 w-auto brightness-0 invert"
        />
        <p className="text-sm leading-relaxed max-w-xs">
          Белорусский производитель уплотнительных и герметизирующих лент EUROBAND.
          Сопутствующие материалы поставляем напрямую от производителей.
        </p>
      </div>

      <div className="space-y-3 text-sm">
        <h2 className="text-white font-semibold">Разделы</h2>
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block hover:text-white transition-colors duration-[120ms]"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3 text-sm">
        <h2 className="text-white font-semibold">Реквизиты</h2>
        <p>УНП 192436058</p>
        <p>г. Минск, ул. Мясникова, 78, оф. 6</p>
        <a href="mailto:info@invit.by" className="block hover:text-white transition-colors">
          info@invit.by
        </a>
        <a href="tel:+375296444979" className="block hover:text-white transition-colors">
          +375 29 644-49-79
        </a>
      </div>
    </div>

    <div className="border-t border-white/15">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 text-sm">
        <span>© 2009-2026 ООО «ИНВИТ». Все права защищены.</span>
      </div>
    </div>
  </footer>
);
