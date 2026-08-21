import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { paths } from '../routes';

export interface Crumb {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  // Каталог живёт в синей обвязке варианта 2, поэтому и «Главная» из него
  // ведёт на синюю главную, а не на зелёную.
  const { pathname } = useLocation();
  const home = pathname.startsWith('/catalog') ? paths.homeV2 : paths.home;

  return (
  <nav aria-label="Хлебные крошки" className="bg-surface-soft border-b border-line">
    <div className="max-w-[1340px] mx-auto px-5 py-3 flex items-center gap-1.5 text-xs text-ink/55 flex-wrap">
      <Link to={home} className="min-h-11 sm:min-h-0 hover:text-brand-blue transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Главная</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-ink/45 shrink-0" />
          {item.to ? (
            <Link to={item.to} className="inline-flex items-center min-h-11 sm:min-h-0 hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </nav>
  );
};

/** Шапка внутренней страницы: заголовок и подзаголовок под крошками. */
export const PageHeading: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
}> = ({ eyebrow, title, description }) => (
  <div className="max-w-[1340px] mx-auto px-5 pt-8 pb-6">
    {eyebrow && (
      <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-1.5">{eyebrow}</div>
    )}
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
      {title}
    </h1>
    {description && (
      <p className="text-ink/70 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
