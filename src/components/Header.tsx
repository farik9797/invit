import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, X, ShoppingBag } from 'lucide-react';
import invitLogo from '../assets/logo/invit-color.svg';
import eurobandLogo from '../assets/logo/euroband-color.svg';
import { PRODUCTS } from '../data/catalogData';
import { Product } from '../types';
import { paths } from '../routes';

interface HeaderProps {
  onOpenCallback: () => void;
  onOpenQuoteCart: () => void;
  quoteCount: number;
  onSelectProduct: (product: Product) => void;
}

const NAV = [
  { to: paths.catalog, label: 'Каталог' },
  { to: paths.about, label: 'О компании' },
  { to: paths.certificates, label: 'Документы' },
  { to: paths.orderStatus, label: 'Статус заказа' },
  { to: paths.news, label: 'Новости' },
  { to: paths.contacts, label: 'Контакты' }
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `py-3.5 text-sm transition-colors border-b-2 ${
    isActive
      ? 'text-brand-blue font-semibold border-brand-blue'
      : 'text-brand-navy/70 hover:text-brand-blue border-transparent'
  }`;

export const Header: React.FC<HeaderProps> = ({
  onOpenCallback,
  onOpenQuoteCart,
  quoteCount,
  onSelectProduct
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const query = searchQuery.trim().toLowerCase();
  const results = query
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.shortTitle.toLowerCase().includes(query) ||
          p.subcategoryName.toLowerCase().includes(query)
      ).slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line">
      <div className="max-w-[1340px] mx-auto px-5 py-4 flex items-center justify-between gap-6">
        {/* Логотипы */}
        <Link to={paths.home} className="flex items-center gap-3 shrink-0">
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-9 sm:h-10 w-auto" />
          <span className="hidden xl:block border-l border-line pl-3">
            <img src={eurobandLogo} alt="EUROBAND" className="h-3.5 w-auto" />
            <span className="block text-[11px] text-brand-navy/50 mt-1">
              Ленты собственного производства
            </span>
          </span>
        </Link>

        {/* Поиск */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-brand-navy/40 absolute left-3.5" />
            <input
              type="text"
              placeholder="Поиск по каталогу"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface-soft border border-line rounded-lg text-brand-navy placeholder:text-brand-navy/40 focus:outline-none focus:border-brand-sky focus:bg-white transition-colors"
            />
          </div>

          {isSearchOpen && query !== '' && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-line rounded-xl shadow-lg z-50 overflow-hidden">
              {results.length > 0 ? (
                results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProduct(p);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-3 hover:bg-surface-soft transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt=""
                      className="w-10 h-10 object-contain bg-white border border-line rounded shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="block text-[11px] text-brand-blue">{p.subcategoryName}</span>
                      <span className="block text-sm text-brand-navy truncate">{p.title}</span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-sm text-brand-navy/60">
                  Ничего не найдено. Напишите нам — подберём аналог.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Действия */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCallback}
            className="hidden sm:inline-flex bg-brand-red hover:bg-brand-red-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Запросить расчёт
          </button>

          <button
            onClick={onOpenQuoteCart}
            className="relative border border-line hover:border-brand-sky text-brand-navy p-2.5 rounded-lg transition-colors cursor-pointer"
            title="Смета КП"
          >
            <ShoppingBag className="w-5 h-5" />
            {quoteCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {quoteCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden border border-line p-2.5 rounded-lg text-brand-navy cursor-pointer"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Навигация */}
      <nav className="hidden md:block border-t border-line">
        <div className="max-w-[1340px] mx-auto px-5 flex items-center gap-7">
          <NavLink to={paths.home} end className={navClass}>
            Главная
          </NavLink>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-surface px-5 py-4 space-y-1">
          <NavLink
            to={paths.home}
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-brand-navy"
          >
            Главная
          </NavLink>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-sm text-brand-navy"
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCallback();
            }}
            className="w-full mt-3 bg-brand-red text-white text-sm font-semibold py-3 rounded-lg cursor-pointer"
          >
            Запросить расчёт
          </button>
        </div>
      )}
    </header>
  );
};
