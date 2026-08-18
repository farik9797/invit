import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import invitLogo from '../assets/logo/invit-color.svg';
import eurobandLogo from '../assets/logo/euroband-color.svg';
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

export const Footer: React.FC<FooterProps> = ({ onOpenCallback }) => (
  <footer className="bg-surface-soft border-t border-line text-sm text-brand-navy/70">
    <div className="max-w-[1340px] mx-auto px-5 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* О компании */}
        <div className="space-y-4">
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-10 w-auto" />
          <img src={eurobandLogo} alt="EUROBAND" className="h-3.5 w-auto" />
          <p className="text-xs leading-relaxed">
            Белорусский производитель уплотнительных и герметизирующих лент EUROBAND. Сопутствующие
            материалы поставляем напрямую от производителей.
          </p>
        </div>

        {/* Ленты */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-brand-navy">Ленты EUROBAND</h4>
          <ul className="space-y-2 text-xs">
            {TAPE_LINKS.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-brand-blue transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Компания */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-brand-navy">Компания</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to={paths.catalog} className="hover:text-brand-blue transition-colors">
                Весь каталог
              </Link>
            </li>
            <li>
              <Link to={paths.about} className="hover:text-brand-blue transition-colors">
                О производстве
              </Link>
            </li>
            <li>
              <Link to={paths.certificates} className="hover:text-brand-blue transition-colors">
                Документы и сертификаты
              </Link>
            </li>
            <li>
              <Link to={paths.orderStatus} className="hover:text-brand-blue transition-colors">
                Статус заказа
              </Link>
            </li>
            <li>
              <button
                onClick={onOpenCallback}
                className="hover:text-brand-blue transition-colors cursor-pointer"
              >
                Запросить прайс-лист
              </button>
            </li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-brand-navy">Контакты</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
              <span>
                <span className="block text-brand-navy font-medium">Минск</span>
                Минский р-н, Сеницкий с/с, 84 (ТЦ Сеница, оф. 9)
              </span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-sky shrink-0 mt-0.5" />
              <span>
                <span className="block text-brand-navy font-medium">Солигорск</span>
                ул. Строителей, 30, оф. 101
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <a
                href="tel:+375296444979"
                className="font-semibold text-brand-navy hover:text-brand-blue transition-colors whitespace-nowrap"
              >
                +375 (29) 644-49-79
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-sky shrink-0" />
              <a href="mailto:info@invit.by" className="hover:text-brand-blue transition-colors">
                info@invit.by
              </a>
            </div>

            <Link
              to={paths.contacts}
              className="inline-block text-brand-blue font-semibold hover:text-brand-blue-hover transition-colors"
            >
              Все контакты и график работы
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-brand-navy/50">
        <span>© 2009–2026 ООО «ИНВИТ». EUROBAND — собственная торговая марка.</span>
        <span>ТКП 45-3.02-223-2010 · ГОСТ 30971-2002 · ТУ BY 600500616.001-2010</span>
      </div>
    </div>
  </footer>
);
