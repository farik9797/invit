import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingBag } from 'lucide-react';
import invitLogo from '../assets/logo/invit-green.svg';
import { PRODUCTS } from '../data/catalogData';
import { Product } from '../types';
import { paths } from '../routes';
import { MegaMenu } from './MegaMenu';

interface HeaderProps {
  onOpenCallback: () => void;
  onOpenQuoteCart: () => void;
  quoteCount: number;
  onSelectProduct: (product: Product) => void;
}

const NAV = [
  { to: paths.about, label: 'О компании' },
  { to: paths.certificates, label: 'Документация' },
  { to: paths.news, label: 'Новости' }
];

const navClass = ({ isActive }: { isActive: boolean }) =>
  `group relative text-sm transition-colors ${
    isActive ? 'text-brand-green font-semibold' : 'text-ink/80 hover:text-brand-green'
  }`;

/** Подчёркивание, которое разворачивается при наведении. */
const NavUnderline: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    className={`absolute -bottom-1 left-0 h-0.5 w-full bg-brand-green origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
    }`}
  />
);

export const Header: React.FC<HeaderProps> = ({
  onOpenCallback,
  onOpenQuoteCart,
  quoteCount,
  onSelectProduct
}) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const openProduct = (product: Product) => {
    onSelectProduct(product);
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-line relative">
      <div className="max-w-[1340px] mx-auto px-5 flex items-stretch justify-between gap-6">
        {/* Логотип */}
        <Link to={paths.home} className="flex items-center gap-3 shrink-0 py-3.5">
          <img src={invitLogo} alt="ООО «ИНВИТ»" className="h-9 sm:h-10 w-auto" />
        </Link>

        {/* Меню */}
        <nav className="hidden lg:flex items-center gap-7">
          <NavLink to={paths.home} end className={navClass}>
            {({ isActive }) => (
              <>
                Главная
                <NavUnderline active={isActive} />
              </>
            )}
          </NavLink>

          <MegaMenu />

          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {({ isActive }) => (
                <>
                  {item.label}
                  <NavUnderline active={isActive} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Действия */}
        <div className="flex items-stretch gap-3 shrink-0">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="self-center p-2.5 text-ink/70 hover:text-brand-green transition-colors cursor-pointer"
            aria-label="Поиск"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenQuoteCart}
            className="relative self-center p-2.5 text-ink/70 hover:text-brand-green transition-colors cursor-pointer"
            title="Корзина"
          >
            <ShoppingBag className="w-5 h-5" />
            {quoteCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-green text-white text-[10px] font-bold px-1.5 rounded-full">
                {quoteCount}
              </span>
            )}
          </button>

          {/* Зелёная кнопка во всю высоту шапки — как на invit.belinfo.by */}
          <Link
            to={paths.contacts}
            className="hidden sm:flex items-center bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold px-8 transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
          >
            Контакты
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden self-center p-2.5 text-ink cursor-pointer"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Поиск раскрывается под шапкой */}
      {searchOpen && (
        <div className="border-t border-line bg-surface-soft">
          <div className="max-w-[1340px] mx-auto px-5 py-4">
            <div className="relative">
              <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-3.5" />
              <input
                autoFocus
                type="text"
                placeholder="Поиск по каталогу"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-line rounded-lg text-ink placeholder:text-ink/40 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>

            {query !== '' && (
              <div className="mt-3 bg-white border border-line rounded-lg overflow-hidden divide-y divide-line max-h-80 overflow-y-auto">
                {results.length > 0 ? (
                  results.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openProduct(p)}
                      className="w-full text-left p-3 hover:bg-surface-soft transition-colors flex items-center gap-3 cursor-pointer"
                    >
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 object-contain bg-white border border-line rounded shrink-0"
                      />
                      <span className="min-w-0">
                        <span className="block text-[11px] text-brand-green">{p.subcategoryName}</span>
                        <span className="block text-sm text-ink truncate">{p.title}</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-sm text-ink/60">
                    Ничего не найдено. Напишите нам — подберём аналог.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-line bg-surface px-5 py-4 space-y-1">
          <NavLink
            to={paths.home}
            end
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-ink"
          >
            Главная
          </NavLink>

          <MegaMenu />

          <NavLink
            to={paths.catalog}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-ink"
          >
            Каталог
          </NavLink>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 text-sm text-ink"
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to={paths.contacts}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-sm text-ink"
          >
            Контакты
          </NavLink>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCallback();
            }}
            className="w-full mt-3 bg-brand-green text-white text-sm font-semibold py-3 rounded-lg cursor-pointer"
          >
            Запросить расчёт
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(paths.catalog);
            }}
            className="w-full border border-line text-ink text-sm font-semibold py-3 rounded-lg cursor-pointer"
          >
            Открыть каталог
          </button>
        </div>
      )}
    </header>
  );
};
