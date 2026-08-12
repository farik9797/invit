import React from 'react';
import { Phone, MapPin, Mail, Factory, ShieldCheck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#1E232A] text-slate-300 text-xs py-2 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left Notice */}
        <div className="flex items-center gap-2 font-medium text-slate-200">
          <span className="bg-[#0B5FA5] text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded flex items-center gap-1">
            <Factory className="w-3 h-3" /> B2B Производитель
          </span>
          <span className="hidden sm:inline">Собственное производство лент EUROBAND | г. Минск</span>
          <span className="text-[#F39200] font-semibold flex items-center gap-1 ml-2">
            <ShieldCheck className="w-3.5 h-3.5" /> СТБ & ГОСТ
          </span>
        </div>

        {/* Right Contacts */}
        <div className="flex items-center gap-4 text-slate-300 flex-wrap justify-center">
          <a
            href="tel:+375296444979"
            className="flex items-center gap-1.5 hover:text-[#F39200] transition-colors font-semibold text-white"
          >
            <Phone className="w-3.5 h-3.5 text-[#F39200]" />
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
