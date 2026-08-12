import React from 'react';
import { Phone, MapPin, Mail, Factory, ShieldCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#1E232A] text-slate-300 text-xs py-2 border-b border-slate-800">
      <div className="max-w-[1340px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left Notice */}
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <span className="bg-brand-red text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded flex items-center gap-1 whitespace-nowrap">
            <Factory className="w-3 h-3" /> Белорусский производитель
          </span>
          <span className="hidden sm:inline truncate">Уплотнительные и герметизирующие ленты EUROBAND | г. Минск</span>
          <span className="text-brand-red-light font-semibold flex items-center gap-1 ml-2 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" /> СТБ & ГОСТ
          </span>
        </div>

        {/* Right Contacts */}
        <div className="flex items-center gap-4 text-slate-300 flex-wrap justify-center">
          <a
            href="tel:+375296444979"
            className="flex items-center gap-1.5 hover:text-brand-red-light transition-colors font-semibold text-white"
          >
            <Phone className="w-3.5 h-3.5 text-brand-red-light" />
            <span>+375 (29) 644-49-79</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>г. Минск, ТЦ Сеница, оф. 9</span>
          </div>

          <a
            href="mailto:info@invit.by"
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>info@invit.by</span>
          </a>

          <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
            <span className="font-bold text-white text-[11px] bg-slate-800 px-1.5 py-0.5 rounded">RU</span>
          </div>
        </div>
      </div>
    </div>
  );
};
