import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';

export const TopBar: React.FC = () => (
  <div className="bg-surface-soft text-brand-navy/70 text-xs border-b border-line">
    <div className="max-w-[1340px] mx-auto px-5 h-9 flex items-center justify-between sm:justify-between gap-4">
      <span className="truncate hidden sm:block">
        Белорусский производитель уплотнительных и герметизирующих лент EUROBAND
      </span>

      <div className="flex items-center gap-5 shrink-0">
        <span className="hidden lg:flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-sky" />
          г. Минск, ТЦ Сеница, оф. 9
        </span>

        <a
          href="mailto:info@invit.by"
          className="hidden md:flex items-center gap-1.5 hover:text-brand-blue transition-colors"
        >
          <Mail className="w-3.5 h-3.5 text-brand-sky" />
          info@invit.by
        </a>

        <a
          href="tel:+375296444979"
          className="flex items-center gap-1.5 font-semibold text-brand-navy hover:text-brand-blue transition-colors whitespace-nowrap"
        >
          <Phone className="w-3.5 h-3.5 text-brand-red" />
          +375 (29) 644-49-79
        </a>
      </div>
    </div>
  </div>
);
