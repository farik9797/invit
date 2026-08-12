import React from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../routes';

export const NotFoundPage: React.FC = () => (
  <section className="max-w-[1340px] mx-auto px-5 py-24 text-center space-y-5">
    <span className="block text-6xl font-black text-brand-blue">404</span>
    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Страница не найдена</h1>
    <p className="text-sm text-slate-600 max-w-md mx-auto">
      Возможно, раздел переехал. Загляните в каталог продукции EUROBAND или напишите нам — подскажем,
      где искать нужную позицию.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Link
        to={paths.catalog}
        className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl transition-colors"
      >
        В каталог
      </Link>
      <Link
        to={paths.home}
        className="border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wide px-6 py-3 rounded-xl transition-colors"
      >
        На главную
      </Link>
    </div>
  </section>
);
