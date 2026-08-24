import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NEWS } from '../../data/catalogData';
import { newsCover, newsCoverFit } from '../../lib/newsCovers';
import { paths } from '../../routes';
import { Reveal, RevealGroup } from '../Reveal';

/*
 * Тот же формат карточки, что и на странице новостей: обложка, дата,
 * заголовок, короткое описание. Обложки подбираются по теме заметки,
 * см. newsCovers.ts — настоящих фото к событиям у клиента нет.
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
          <article key={article.id} className="h-full">
            <Link
              to={paths.newsArticle(article.id)}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="block h-44 overflow-hidden bg-surface-soft">
                <img
                  src={newsCover(article.id)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className={`h-full w-full ${newsCoverFit(article.id)} transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]`}
                />
              </span>

              <span className="flex flex-1 flex-col p-5">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/55">
                  <span className="tabular-nums">{article.date}</span>
                  <span className="text-brand-blue">{article.category}</span>
                </span>

                <span className="mt-3 block text-sm font-semibold leading-snug text-ink group-hover:text-brand-blue transition-colors">
                  {article.title}
                </span>

                <span className="mt-2 block text-xs leading-relaxed text-ink/60 line-clamp-3">
                  {excerpt(article)}
                </span>
              </span>
            </Link>
          </article>
        ))}
      </RevealGroup>

      <div className="mt-12 text-center">
        <Link
          to={paths.news}
          className="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-brand-blue transition-colors"
        >
          Ко всем новостям
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </section>
);
