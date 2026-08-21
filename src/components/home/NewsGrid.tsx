import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NEWS } from '../../data/catalogData';
import { paths } from '../../routes';

const SHORT_MONTH: Record<string, string> = {
  января: 'янв',
  февраля: 'фев',
  марта: 'мар',
  апреля: 'апр',
  мая: 'мая',
  июня: 'июн',
  июля: 'июл',
  августа: 'авг',
  сентября: 'сен',
  октября: 'окт',
  ноября: 'ноя',
  декабря: 'дек'
};

/** «8 декабря 2025» -> { day: '8', month: 'дек 25' } для плашки на фото. */
const splitDate = (date: string) => {
  const [day, month, year] = date.split(' ');
  return { day, month: `${SHORT_MONTH[month] ?? month} ${(year ?? '').slice(2)}` };
};

export const NewsGrid: React.FC = () => (
  <section className="py-16 sm:py-24 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5">
      <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight text-center">Новости</h2>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEWS.slice(0, 4).map((article) => {
          const { day, month } = splitDate(article.date);

          return (
            <article key={article.id} className="group">
              <Link
                to={paths.newsArticle(article.id)}
                className="relative block bg-white border border-line overflow-hidden"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-44 object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                />
                {/* Зелёная плашка с датой в углу фото */}
                <span className="absolute bottom-0 right-0 bg-brand-green text-white px-3 py-2 text-center leading-none">
                  <span className="block text-lg font-bold">{day}</span>
                  <span className="block text-[10px] mt-0.5 opacity-90">{month}</span>
                </span>
              </Link>

              <Link
                to={paths.newsArticle(article.id)}
                className="mt-4 block text-sm font-semibold text-ink leading-snug hover:text-brand-green transition-colors"
              >
                {article.title}
              </Link>

              <span className="mt-2 block text-[11px] text-brand-green">· {article.category}</span>

              <p className="mt-2 text-xs text-ink/60 leading-relaxed line-clamp-5">
                {article.summary}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link
          to={paths.news}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-brand-green transition-colors"
        >
          Ко всем новостям
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);
