import React from 'react';
import { Phone, MapPin, Mail, Clock, Layers, ShieldCheck, Factory, Send } from 'lucide-react';
import invitLogoMono from '../assets/logo/invit-mono.svg';
import eurobandLogoMono from '../assets/logo/euroband-mono.svg';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenCallback: () => void;
  setActiveSection: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenCallback, setActiveSection }) => {
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
              <li>
                <button
                  onClick={() => onSelectCategory('montazhnye-lenty')}
                  className="hover:text-white transition-colors text-left"
                >
                  Монтажные ленты для окон
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('montazhnye-lenty')}
                  className="hover:text-white transition-colors text-left"
                >
                  ПСУЛ уплотнительные ленты
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('montazhnye-lenty')}
                  className="hover:text-white transition-colors text-left"
                >
                  Монтажная пена и герметики
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('komplektuyushchie-ventilyacii')}
                  className="hover:text-white transition-colors text-left"
                >
                  Фланцевый профиль (Шинорейка)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('komplektuyushchie-ventilyacii')}
                  className="hover:text-white transition-colors text-left"
                >
                  Монтажные уголки УГ-20/30
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('komplektuyushchie-ventilyacii')}
                  className="hover:text-white transition-colors text-left"
                >
                  Траверсы C-образные и ленты ПЭС
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Buyers */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Покупателям & Партнерам
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveSection('manufacturing');
                    document.getElementById('manufacturing')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  О заводе ООО «ИНВИТ»
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection('certificates');
                    document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors text-left"
                >
                  Сертификаты СТБ & ГОСТ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection('tracking');
                    document.getElementById('tracking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Отслеживание статуса заказа
                </button>
              </li>
              <li>
                <button onClick={onOpenCallback} className="hover:text-white transition-colors">
                  Запросить оптовый прайс-лист (.XLSX)
                </button>
              </li>
              <li>
                <button onClick={onOpenCallback} className="hover:text-white transition-colors">
                  Условия доставки по РБ и ЕАЭС
                </button>
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
