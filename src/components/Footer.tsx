import React from 'react';
import { Link } from 'react-router-dom';
import invitLogo from '../assets/logo/invit-mono.svg';
import { paths } from '../routes';
import { TAPE_SUBCATEGORIES } from '../lib/product';
import { CATEGORIES } from '../data/catalogData';

interface FooterProps {
  onOpenCallback: () => void;
}

/** Ссылки на разделы лент — то, что производим сами. */
const TAPE_LINKS = CATEGORIES.flatMap((category) =>
  category.subcategories
    .filter((sub) => TAPE_SUBCATEGORIES.includes(sub.slug))
    .map((sub) => ({
      label: sub.name,
      href: `${paths.category(category.slug)}?sub=${sub.slug}`
    }))
);

const SECTIONS = [
  { label: 'Каталог', to: paths.catalog },
  { label: 'О компании', to: paths.about },
  { label: 'Документация', to: paths.certificates },
  { label: 'Новости', to: paths.news },
  { label: 'Контакты', to: paths.contacts }
];

/** Тёмный подвал в четыре колонки — как на invit.belinfo.by. */
export const Footer: React.FC<FooterProps> = ({ onOpenCallback }) => (
  <footer className="bg-ink text-white/60 text-sm">
    <div className="max-w-[1340px] mx-auto px-5 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Компания */}
        <div className="space-y-4">
          <img
            src={invitLogo}
            alt="ООО «ИНВИТ»"
            className="h-9 w-auto brightness-0 invert"
          />
          <p className="text-xs leading-relaxed">
            Общество с ограниченной ответственностью «ИНВИТ» — белорусский производитель
            уплотнительных и герметизирующих лент EUROBAND.
          </p>
          <p className="text-xs leading-relaxed">
            Сопутствующие материалы поставляем напрямую от производителей.
          </p>

          <dl className="pt-2 space-y-2 text-xs">
            <div>
              <dt className="text-white/80">УНП</dt>
              <dd>600500616</dd>
            </div>
            <div>
              <dt className="text-white/80">Юридический адрес</dt>
              <dd>Минская обл., г. Солигорск, ул. Строителей, 30, каб. 101</dd>
            </div>
          </dl>
          {/* Расчётный счёт клиент пока не давал — добавить сюда, когда пришлёт */}
        </div>

        {/* Адрес */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Адрес</h4>
          <p className="text-xs leading-relaxed">
            Минский р-н, Сеницкий сельсовет,
            <br />
            84 (ТЦ «Сеница», оф. 9)
          </p>
          <p className="text-xs leading-relaxed">
            Солигорск, ул. Строителей, 30, оф. 101
          </p>

          <h4 className="pt-3 text-sm font-semibold text-white">Время работы</h4>
          <p className="text-xs leading-relaxed">
            Пн–Чт: 9:00–17:30
            <br />
            Пт: 9:00–16:00
          </p>
        </div>

        {/* Телефоны */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Телефоны</h4>

          <div className="text-xs space-y-1">
            <span className="block text-white/80">Минск:</span>
            <a
              href="tel:+375296444979"
              className="block hover:text-brand-green transition-colors whitespace-nowrap"
            >
              +375 29 644-49-79 <span className="text-white/40">(многоканальный)</span>
            </a>
            <a
              href="tel:+375173437736"
              className="block hover:text-brand-green transition-colors whitespace-nowrap"
            >
              +375 17 343-77-36
            </a>
          </div>

          <div className="text-xs space-y-1 pt-2">
            <span className="block text-white/80">Солигорск:</span>
            <a href="tel:+375174325022" className="block hover:text-brand-green transition-colors">
              +375 174 32-50-22
            </a>
            <a href="tel:+375174252225" className="block hover:text-brand-green transition-colors">
              +375 174 25-22-25
            </a>
            <a href="tel:+375296444270" className="block hover:text-brand-green transition-colors">
              +375 29 644-42-70
            </a>
          </div>

          <div className="text-xs pt-2">
            <span className="block text-white/80">E-mail:</span>
            <a href="mailto:info@invit.by" className="hover:text-brand-green transition-colors">
              info@invit.by
            </a>
          </div>
        </div>

        {/* Разделы */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white">Разделы</h4>
          <ul className="space-y-2 text-xs">
            {SECTIONS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-brand-green transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={onOpenCallback}
                className="hover:text-brand-green transition-colors cursor-pointer"
              >
                Запросить прайс-лист
              </button>
            </li>
          </ul>

          <h4 className="pt-3 text-sm font-semibold text-white">Ленты EUROBAND</h4>
          <ul className="space-y-2 text-xs">
            {TAPE_LINKS.slice(0, 4).map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-brand-green transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="max-w-[1340px] mx-auto px-5 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40">
        <span>
          © 2001–2026 Общество с ограниченной ответственностью «ИНВИТ». Все права защищены.
        </span>
        <span>EUROBAND — собственная торговая марка</span>
      </div>
    </div>
  </footer>
);
