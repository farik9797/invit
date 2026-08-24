import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../../data/catalogData';
import { TAPE_SUBCATEGORIES } from '../../lib/product';
import { SectionIcon } from '../../lib/sectionIcons';
import { paths } from '../../routes';

/*
 * Мега-меню в формате, который выбрал клиент (референс stmg.by):
 * слева список разделов, справа широкая панель с колонками.
 * Отличие по цветам: выбранный раздел красный (в референсе оранжевый),
 * заголовки подразделов синие.
 */

interface MenuGroup {
  name: string;
  href: string;
  /** Слаг нужен, чтобы подобрать линейную иконку раздела. */
  slug: string;
  items: { title: string; href: string }[];
}

interface MenuSection {
  id: string;
  label: string;
  href: string;
  groups: MenuGroup[];
}

/** До пяти товаров на подраздел: колонка остаётся читаемой. */
const ITEMS_PER_GROUP = 5;

const ownFirst = (a: { badge?: string }, b: { badge?: string }) =>
  (a.badge === 'Собственное производство' ? 0 : 1) -
  (b.badge === 'Собственное производство' ? 0 : 1);

const groupFor = (categorySlug: string, subSlug: string, name: string): MenuGroup => {
  const items = PRODUCTS.filter((p) => p.subcategorySlug === subSlug).sort(ownFirst);

  return {
    name,
    href: `${paths.category(categorySlug)}?sub=${subSlug}`,
    slug: subSlug,
    items: items
      .slice(0, ITEMS_PER_GROUP)
      .map((p) => ({ title: p.shortTitle, href: paths.product(p) }))
  };
};

const subName = (slug: string) =>
  PRODUCTS.find((p) => p.subcategorySlug === slug)?.subcategoryName ?? slug;

const categoryOf = (slug: string) =>
  PRODUCTS.find((p) => p.subcategorySlug === slug)?.categorySlug ?? CATEGORIES[0].slug;

const SECTIONS: MenuSection[] = [
  {
    id: 'tapes',
    label: 'Ленты EUROBAND',
    href: paths.catalog,
    groups: TAPE_SUBCATEGORIES.map((slug) => groupFor(categoryOf(slug), slug, subName(slug)))
  },
  ...CATEGORIES.map((category) => ({
    id: category.slug,
    label: category.name,
    href: paths.category(category.slug),
    groups: category.subcategories.map((sub) => groupFor(category.slug, sub.slug, sub.name))
  }))
];

export const MegaMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();

  // Закрываем по Esc и по клику мимо меню
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // И при переходе на другую страницу
  useEffect(() => setOpen(false), [pathname, search]);

  const section = SECTIONS[active];

  // Панель позиционируется относительно всей шапки, а не кнопки: иначе она
  // упирается в правый край окна. Поэтому на обёртке `relative` намеренно нет.
  return (
    <div ref={wrapRef} className="hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mega-menu"
        className={`inline-flex items-center gap-2 min-h-11 px-4 rounded-[4px] text-sm font-semibold text-white whitespace-nowrap cursor-pointer transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue ${
          open ? 'bg-inv-blue-pressed' : 'bg-inv-blue hover:bg-inv-blue-hover'
        }`}
      >
        <Menu className="w-4 h-4" />
        Каталог товаров
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id="mega-menu"
          onMouseLeave={() => setOpen(false)}
          className="absolute left-0 right-0 top-full z-40 pt-3"
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex rounded-[8px] border border-inv-border bg-white shadow-[0_6px_24px_rgba(22,44,88,0.16)] overflow-hidden">
              {/* Разделы. Выбранный красный, как просил клиент */}
              <ul className="w-[264px] shrink-0 border-r border-inv-border bg-inv-surface-1 py-2">
                {SECTIONS.map((item, idx) => {
                  const isActive = idx === active;

                  return (
                    <li key={item.id}>
                      <Link
                        to={item.href}
                        onMouseEnter={() => setActive(idx)}
                        onFocus={() => setActive(idx)}
                        aria-current={isActive}
                        className={`flex items-center justify-between gap-3 min-h-11 px-5 text-sm transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue ${
                          isActive
                            ? 'bg-white text-inv-red font-semibold'
                            : 'text-inv-ink hover:text-inv-red'
                        }`}
                      >
                        {item.label}
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Подразделы: заголовок синий, под ним товары */}
              <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto">
                <div className="columns-2 xl:columns-3 gap-8">
                  {section.groups.map((group) => (
                    <div key={group.href} className="break-inside-avoid mb-6">
                      <Link
                        to={group.href}
                        className="flex items-center gap-2.5 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-inv-border bg-white">
                          <SectionIcon slug={group.slug} className="w-5 h-5" />
                        </span>
                        <span className="leading-snug">{group.name}</span>
                      </Link>

                      <ul className="mt-2 space-y-1">
                        {group.items.map((item) => (
                          <li key={item.href} className="flex gap-1.5 text-[13px] leading-snug">
                            <span aria-hidden className="text-inv-ink-muted/50">
                              -
                            </span>
                            <Link
                              to={item.href}
                              className="text-inv-ink hover:text-inv-blue transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Link
                  to={section.href}
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  Все позиции раздела
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Те же разделы списком — для мобильного меню, где мега-меню не показываем. */
export const MOBILE_CATALOG_LINKS = SECTIONS.map(({ label, href }) => ({ label, href }));
