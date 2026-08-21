import React from 'react';

/** Тонкая тёмная полоса как на invit.belinfo.by: график работы слева, контакты справа. */
export const TopBar: React.FC = () => (
  <div className="bg-ink text-white/70 text-xs">
    <div className="max-w-[1340px] mx-auto px-5 h-9 flex items-center justify-between gap-4">
      <span className="truncate">
        <span className="hidden sm:inline">Время работы: </span>
        Пн–Чт: 9:00–17:30, Пт: 9:00–16:00
      </span>

      <div className="flex items-center gap-5 shrink-0">
        <span className="hidden md:inline">
          Телефон:{' '}
          <a
            href="tel:+375296444979"
            className="text-white hover:text-brand-green transition-colors whitespace-nowrap"
          >
            +375 29 644-49-79
          </a>
        </span>
        <a
          href="tel:+375296444979"
          className="md:hidden text-white hover:text-brand-green transition-colors whitespace-nowrap"
        >
          +375 29 644-49-79
        </a>
        <span className="hidden lg:inline">
          Email:{' '}
          <a href="mailto:info@invit.by" className="text-white hover:text-brand-green transition-colors">
            info@invit.by
          </a>
        </span>
      </div>
    </div>
  </div>
);
