import React from 'react';
import { Phone, MapPin, Mail, Clock, Layers, ShieldCheck, Factory, Send } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenCallback: () => void;
  setActiveSection: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenCallback, setActiveSection }) => {
  return (
    <footer className="bg-[#12161C] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: About Company */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-[#0B5FA5] text-white font-black text-lg px-2.5 py-1 rounded shadow-sm border-b-2 border-[#F39200]">
                ИНВИТ
              </div>
              <div>
                <span className="block font-black text-white text-xs tracking-wider">
                  EUROBAND
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Завод строительной изоляции
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              ООО «ИНВИТ» — официальный производитель систем монтажных лент, ПСУЛ, пенополиэтилена и комплектующих для вентиляционных систем торговой марки EUROBAND в Минске.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://viber.click"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-[#0B5FA5] text-white rounded-lg transition-colors font-bold text-[10px]"
              >
                Viber
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-[#0B5FA5] text-white rounded-lg transition-colors font-bold text-[10px]"
              >
                Telegram
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-[#0B5FA5] text-white rounded-lg transition-colors font-bold text-[10px]"
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
            <div className="space-y-2.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F39200] shrink-0 mt-0.5" />
                <span>г. Минск, ТЦ Сеница, оф. 9 (развязка МКАД и Слуцкого направления)</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F39200] shrink-0" />
                <a href="tel:+375296444979" className="text-white font-bold hover:text-[#F39200]">
                  +375 (29) 644-49-79
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F39200] shrink-0" />
                <a href="mailto:info@invit.by" className="hover:text-white">
                  info@invit.by
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F39200] shrink-0" />
                <span>Пн–Пт: 08:30 – 17:30 (Сб, Вс — вых)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © 2009–2026 ООО «ИНВИТ». Ленты и уплотнители EUROBAND. Все права защищены. УНП 191234567.
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
