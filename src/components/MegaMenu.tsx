import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { CATEGORIES, PRODUCTS } from '../data/catalogData';
import { TAPE_SUBCATEGORIES } from '../lib/product';
import { paths } from '../routes';

interface MenuItem {
  name: string;
  count: number;
  href: string;
}

const collect = (own: boolean): MenuItem[] =>
  CATEGORIES.flatMap((category) =>
    category.subcategories
      .filter((sub) => TAPE_SUBCATEGORIES.includes(sub.slug) === own)
      .map((sub) => ({
        name: sub.name,
        count: PRODUCTS.filter((p) => p.subcategorySlug === sub.slug).length,
        href: `${paths.category(category.slug)}?sub=${sub.slug}`
      }))
  );

const OWN = collect(true);
const RELATED = collect(false);
const PROMO = PRODUCTS.find((p) => p.slug === 'psul-euroband-dlja-okon') ?? PRODUCTS[0];

/** Выпадающий каталог во всю ширину — открывается наведением и с клавиатуры. */
export const MegaMenu: React.FC = () => {
  const reduced = useReducedMotion();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  // Закрываем при переходе на другую страницу
  useEffect(() => setOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const isCatalog = location.pathname.startsWith(paths.catalog);

  return (
    <div onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`group relative flex items-center gap-1.5 text-sm transition-colors cursor-pointer ${
          isCatalog || open ? 'text-brand-green font-semibold' : 'text-ink/80 hover:text-brand-green'
        }`}
      >
        Каталог
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? 'rotate-180' : ''
          }`}
        />
        <span
          className={`absolute -bottom-1 left-0 h-0.5 w-[calc(100%-1.25rem)] bg-brand-green origin-left transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isCatalog || open ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full bg-white border-t border-line shadow-xl"
          >
            <div className="max-w-[1340px] mx-auto px-5 py-10 grid lg:grid-cols-12 gap-10">
              {/* Собственное производство */}
              <div className="lg:col-span-4">
                <span className="text-xs font-semibold text-brand-green">
                  Собственное производство
                </span>
                <ul className="mt-4 space-y-2.5">
                  {OWN.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="group flex items-baseline justify-between gap-3 text-sm text-ink/80 hover:text-brand-green transition-colors"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          {item.name}
                        </span>
                        <span className="text-xs text-ink/35">{item.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Сопутствующие товары */}
              <div className="lg:col-span-5">
                <span className="text-xs font-semibold text-ink/45">
                  Сопутствующие товары · прямые поставки
                </span>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {RELATED.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className="group flex items-baseline justify-between gap-3 text-sm text-ink/70 hover:text-brand-green transition-colors"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          {item.name}
                        </span>
                        <span className="text-xs text-ink/35">{item.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Промо */}
              <div className="lg:col-span-3">
                <Link
                  to={paths.product(PROMO)}
                  className="group block border border-line hover:border-brand-green transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  <div className="bg-white overflow-hidden">
                    <img
                      src={PROMO.image}
                      alt={PROMO.title}
                      loading="lazy"
                      className="w-full h-32 object-contain p-4 group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    />
                  </div>
                  <div className="p-4 border-t border-line">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-green">
                      Хит производства
                    </span>
                    <span className="mt-1 block text-sm font-semibold text-ink leading-snug line-clamp-2">
                      {PROMO.title}
                    </span>
                  </div>
                </Link>

                <Link
                  to={paths.catalog}
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors"
                >
                  Весь каталог — {PRODUCTS.length} позиций
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
