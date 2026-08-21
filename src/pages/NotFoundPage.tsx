import React from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../routes';

export const NotFoundPage: React.FC = () => (
  <section className="max-w-[1340px] mx-auto px-5 py-24 text-center space-y-5">
    <span className="block text-6xl font-bold text-brand-blue">404</span>
    <h1 className="text-2xl font-bold text-ink tracking-tight">Страница не найдена</h1>
    <p className="text-sm text-ink/70 max-w-md mx-auto">
      Возможно, раздел переехал. Загляните в каталог продукции EUROBAND или напишите нам — подскажем,
      где искать нужную позицию.
    </p>
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Link
        to={paths.catalog}
        className="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
      >
        В каталог
      </Link>
      <Link
        to={paths.home}
        className="border border-line hover:bg-surface-soft text-ink font-bold text-sm px-6 py-3 rounded-xl transition-colors"
      >
        На главную
      </Link>
    </div>
  </section>
);
