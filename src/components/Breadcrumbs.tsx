import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { paths } from '../routes';

export interface Crumb {
  label: string;
  to?: string;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => (
  <nav aria-label="Хлебные крошки" className="bg-slate-100 border-b border-slate-200">
    <div className="max-w-[1340px] mx-auto px-5 py-3 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
      <Link to={paths.home} className="hover:text-brand-blue transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>Главная</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {item.to ? (
            <Link to={item.to} className="hover:text-brand-blue transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </nav>
);

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
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
      {title}
    </h1>
    {description && (
      <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
        {description}
      </p>
    )}
  </div>
);
