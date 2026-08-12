import React, { useState } from 'react';
import { Search, Phone, FileText, Menu, X, ShoppingBag, Shield, Layers, ChevronDown } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/catalogData';
import { Product } from '../types';

interface HeaderProps {
  onOpenCallback: () => void;
  onOpenQuoteCart: () => void;
  quoteCount: number;
  onSelectProduct: (product: Product) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCallback,
  onOpenQuoteCart,
  quoteCount,
  onSelectProduct,
  activeSection,
  setActiveSection
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live filter products for instant auto-complete search
  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subcategoryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navItems = [
    { id: 'main', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
    { id: 'manufacturing', label: 'О компании & Завод' },
    { id: 'tracking', label: 'Статус заказа' },
    { id: 'certificates', label: 'Сертификаты (СТБ)' },
    { id: 'news', label: 'Новости' },
    { id: 'contacts', label: 'Контакты' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-200">
      {/* Upper Main Header */}
      <div className="max-w-[1340px] mx-auto px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('main')}>
            <div className="bg-[#0B5FA5] text-white font-black tracking-wider text-xl sm:text-2xl px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5 border-b-2 border-[#F39200]">
              <Layers className="w-6 h-6 text-[#F39200]" />
              <span>ИНВИТ</span>
            </div>
            <div className="hidden sm:block border-l border-slate-300 pl-3">
              <span className="block font-black tracking-widest text-slate-900 text-sm uppercase leading-tight">
                EUROBAND<span className="text-[#0B5FA5]">.BY</span>
              </span>
              <span className="block text-[11px] font-medium text-slate-500 leading-none mt-0.5">
                Завод клейких лент & уплотнителей
              </span>
            </div>
          </div>

          {/* SEARCH BAR CENTER (SmartTech index-3 archetype) */}
          <div className="relative flex-1 max-w-2xl mx-2 hidden md:block">
            <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0B5FA5] focus-within:border-transparent transition-all shadow-inner">
              {/* Category Dropdown inside Search */}
              <div className="relative border-r border-slate-200 bg-slate-100 shrink-0">
                <select
                  className="appearance-none bg-transparent py-2.5 pl-3 pr-8 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                  onChange={(e) => {
                    const catSlug = e.target.value;
                    if (catSlug) {
                      const el = document.getElementById('catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <option value="">Все категории</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3.5 pointer-events-none" />
              </div>

              {/* Input field */}
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  placeholder="Поиск по названию, артикулу (напр. EB-IN-70) или СТБ..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full pl-9 pr-4 py-2.5 bg-transparent text-slate-800 text-sm focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              </div>

              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="bg-[#0B5FA5] hover:bg-[#1A6DB5] text-white text-xs font-bold px-4 py-2.5 transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
              >
                Найти
              </button>
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim() !== '' && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
                <div className="bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 flex justify-between items-center border-b border-slate-200">
                  <span>Результаты поиска ({filteredProducts.length})</span>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs"
                  >
                    Закрыть
                  </button>
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectProduct(p);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              Артикул: {p.code}
                            </span>
                            <span className="text-[10px] text-[#0B5FA5] font-semibold">
                              {p.subcategoryName}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                            {p.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    По запросу «{searchQuery}» ничего не найдено. Напишите нам для заказа спец-позиции!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* HOTLINE & B2B QUOTE BASKET BUTTONS */}
          <div className="flex items-center gap-3">
            {/* Phone Hotline */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Отдел оптовых продаж
              </span>
              <a
                href="tel:+375296444979"
                className="text-base font-extrabold text-[#0B5FA5] hover:text-[#1A6DB5] transition-colors leading-none"
              >
                +375 (29) 644-49-79
              </a>
            </div>

            {/* Quick Callback Trigger Button */}
            <button
              onClick={onOpenCallback}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#F39200] hover:bg-[#E08200] active:scale-95 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-lg shadow transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Оставить заявку</span>
            </button>

            {/* B2B Quote Basket Button */}
            <button
              onClick={onOpenQuoteCart}
              className="relative bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 p-2.5 rounded-lg flex items-center gap-2 transition-all cursor-pointer"
              title="Запросить расчет КП"
            >
              <ShoppingBag className="w-5 h-5 text-[#0B5FA5]" />
              <span className="hidden xl:inline text-xs font-bold uppercase text-slate-700">
                Смета КП
              </span>
              {quoteCount > 0 && (
                <span className="bg-[#F39200] text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {quoteCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#0B5FA5] rounded-lg border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* LOWER NAVIGATION MENU BAR */}
      <nav className="bg-[#0B5FA5] text-white border-t border-blue-600/30">
        <div className="max-w-[1340px] mx-auto px-5">
          <div className="hidden md:flex items-center justify-between font-medium text-sm">
            <div className="flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-3 transition-colors rounded-t-sm flex items-center gap-1 font-medium ${
                    activeSection === item.id
                      ? 'bg-white text-[#0B5FA5] font-bold shadow-sm'
                      : 'hover:bg-[#1A6DB5] text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-2 text-xs text-blue-100 bg-blue-900/40 px-3 py-1.5 rounded">
              <Shield className="w-3.5 h-3.5 text-[#F39200]" />
              <span>Оптовые поставки напрямую с завода EUROBAND</span>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1E232A] text-slate-100 px-4 pt-3 pb-6 border-t border-slate-800 space-y-3">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Поиск по каталогу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800 text-white text-sm rounded border border-slate-700 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                    activeSection === item.id ? 'bg-[#0B5FA5] text-white font-bold' : 'hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">
                Телефон отдела продаж:
              </div>
              <a
                href="tel:+375296444979"
                className="block text-lg font-bold text-[#F39200]"
              >
                +375 (29) 644-49-79
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCallback();
                }}
                className="w-full bg-[#F39200] hover:bg-[#E08200] text-white font-bold py-2.5 rounded text-xs uppercase"
              >
                Оставить заявку на расчет
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
