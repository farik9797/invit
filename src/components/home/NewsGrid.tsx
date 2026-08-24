import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NEWS } from '../../data/catalogData';
import { paths } from '../../routes';
import { Reveal, RevealGroup } from '../Reveal';

/*
 * К заметкам на invit.by приложен клипарт нулевых: эмблема палаты, картинка
 * телефона, печать «важная информация». Рядом с фото лент он выглядел
 * чужеродно, поэтому картинок здесь нет — как и на странице новостей.
 *
 * `summary` в данных обрезан на полуслове ещё при выгрузке, поэтому анонс
 * берём из первого абзаца `content`.
 */
const excerpt = (article: (typeof NEWS)[number]) => article.content.split('\n')[0];

export const NewsGrid: React.FC = () => (
  <section className="py-16 sm:py-24 bg-surface">
    <div className="max-w-[1340px] mx-auto px-5">
      <Reveal>
        <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight text-center">
          Новости
        </h2>
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {NEWS.slice(0, 3).map((article) => (
          <article key={article.id} className="group h-full">
            <Link
              to={paths.newsArticle(article.id)}
              className="flex flex-col h-full border border-line bg-white p-5 hover:border-brand-green transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/55">
                <span className="tabular-nums">{article.date}</span>
                <span className="text-brand-green">{article.category}</span>
              </span>

              <span className="mt-3 block text-sm font-semibold text-ink leading-snug group-hover:text-brand-green transition-colors">
                {article.title}
              </span>

              <span className="mt-2 block text-xs text-ink/60 leading-relaxed line-clamp-4">
                {excerpt(article)}
              </span>
            </Link>
          </article>
        ))}
      </RevealGroup>

      <div className="mt-12 text-center">
        <Link
          to={paths.news}
          className="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-brand-green transition-colors"
        >
          Ко всем новостям
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);
