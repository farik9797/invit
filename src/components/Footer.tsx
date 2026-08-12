import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Clock, Layers, ShieldCheck, Factory, Send } from 'lucide-react';
import invitLogoMono from '../assets/logo/invit-mono.svg';
import eurobandLogoMono from '../assets/logo/euroband-mono.svg';
import { paths } from '../routes';

interface FooterProps {
  onOpenCallback: () => void;
}

const CATALOG_LINKS = [
  { label: 'Монтажные ленты для окон', slug: 'montazhnye-lenty', sub: 'Монтажные ленты' },
  { label: 'ПСУЛ уплотнительные ленты', slug: 'montazhnye-lenty', sub: 'ПСУЛ' },
  { label: 'Монтажная пена и герметики', slug: 'montazhnye-lenty', sub: 'Пена и очистители' },
  { label: 'Фланцевый профиль (Шинорейка)', slug: 'komplektuyushchie-ventilyacii', sub: 'Фланцевый профиль' },
  { label: 'Монтажные уголки УГ-20/30', slug: 'komplektuyushchie-ventilyacii', sub: 'Монтажные уголки' },
  { label: 'Траверсы C-образные и ленты ПЭС', slug: 'komplektuyushchie-ventilyacii', sub: 'Траверса' }
];

export const Footer: React.FC<FooterProps> = ({ onOpenCallback }) => {
  return (
    <footer className="bg-[#12161C] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-[1340px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About Company */}
          <div className="space-y-4">
            <div className="space-y-3">
              <img
                src={invitLogoMono}
                alt="ООО «ИНВИТ» — надёжные системы"
                className="h-10 w-auto brightness-0 invert"
              />
              <img
                src={eurobandLogoMono}
                alt="EUROBAND"
                className="h-4 w-auto brightness-0 invert opacity-90"
              />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              ООО «ИНВИТ» — белорусский производитель уплотнительных и герметизирующих бутилкаучуковых лент EUROBAND для строительства. Также поставляем комплектующие для изготовления и монтажа воздуховодов и систем вентиляции.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://viber.click"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-brand-blue text-white rounded-lg transition-colors font-bold text-[10px]"
              >
                Viber
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-brand-blue text-white rounded-lg transition-colors font-bold text-[10px]"
              >
                Telegram
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-brand-blue text-white rounded-lg transition-colors font-bold text-[10px]"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Column 2: Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Каталог EUROBAND
            </h4>
            <ul className="space-y-2">
              {CATALOG_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={`${paths.category(link.slug)}?sub=${encodeURIComponent(link.sub)}`}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Buyers */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Покупателям & Партнерам
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to={paths.about} className="hover:text-white transition-colors">
                  О заводе ООО «ИНВИТ»
                </Link>
              </li>
              <li>
                <Link to={paths.certificates} className="hover:text-white transition-colors">
                  Сертификаты СТБ & ГОСТ
                </Link>
              </li>
              <li>
                <Link to={paths.orderStatus} className="hover:text-white transition-colors">
                  Отслеживание статуса заказа
                </Link>
              </li>
              <li>
                <button onClick={onOpenCallback} className="hover:text-white transition-colors cursor-pointer">
                  Запросить оптовый прайс-лист (.XLSX)
                </button>
              </li>
              <li>
                <Link to={paths.contacts} className="hover:text-white transition-colors">
                  Условия доставки по РБ и ЕАЭС
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Контакты офиса и склада
            </h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-red-light shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-white font-semibold">Минск</span>
                    Минский р-н, Сеницкий с/с, 84 (ТЦ Сеница, оф. 9)
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <a href="tel:+375296444979" className="whitespace-nowrap text-white font-bold hover:text-brand-red-light">
                    +375 (29) 644-49-79
                  </a>
                  <span className="text-slate-600">·</span>
                  <a href="tel:+375173437736" className="whitespace-nowrap hover:text-white">
                    +375 (17) 343-77-36
                  </a>
                </div>
                <div className="flex items-center gap-2 pl-6 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Пн–Чт: 9:00–17:30, Пт: 9:00–16:00</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-800">
                <div className="flex items-start gap-2 pt-2">
                  <MapPin className="w-4 h-4 text-brand-red-light shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-white font-semibold">Солигорск</span>
                    223701, ул. Строителей, 30, оф. 101
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <a href="tel:+375174325022" className="whitespace-nowrap hover:text-white">
                    +375 (174) 32-50-22
                  </a>
                  <span className="text-slate-600">·</span>
                  <a href="tel:+375296444270" className="whitespace-nowrap hover:text-white">
                    +375 (29) 644-42-70
                  </a>
                </div>
                <div className="flex items-center gap-2 pl-6 text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Пн–Пт: 8:00–17:00</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <Mail className="w-4 h-4 text-brand-red-light shrink-0 mt-2" />
                <a href="mailto:info@invit.by" className="hover:text-white mt-2">
                  info@invit.by
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © 2009–2026 ООО «ИНВИТ». Ленты и уплотнители EUROBAND — собственная торговая марка. Все права защищены.
          </div>
          <div className="flex items-center gap-4">
            <span>СТБ 1488-2004</span>
            <span>·</span>
            <span>ГОСТ РБ</span>
            <span>·</span>
            <span>БелТПП</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
