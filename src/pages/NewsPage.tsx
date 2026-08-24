import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FadeGroup } from '../components/home-v2/Chrome';
import { NEWS } from '../data/catalogData';
import { newsCover, newsCoverFit } from '../lib/newsCovers';
import { paths } from '../routes';

/*
 * Формат карточек клиент выбрал по референсу: обложка, дата, заголовок,
 * короткое описание. Обложки подбираются по теме заметки (см. newsCovers.ts) —
 * настоящих фотографий к событиям у клиента нет.
 *
 * `summary` в данных обрезан на полуслове ещё при выгрузке, поэтому анонс
 * берём из первого абзаца `content`: он заканчивается точкой.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';

const excerpt = (article: (typeof NEWS)[number]) => article.content.split('\n')[0];

export const NewsPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Новости' }]} />

    <section className="bg-inv-deep text-white">
      <div className={`${WRAP} py-10 sm:py-14 lg:py-20`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
          <h1 className="lg:col-span-7 text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">
            Новости компании
          </h1>
          <p className="lg:col-span-5 text-base leading-[1.55] text-inv-on-deep">
            Подтверждение статуса производителя, переезды офиса и склада, изменения
            реквизитов и контактов.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-white">
      <div className={`${WRAP} py-10 sm:py-14 lg:py-20`}>
        <FadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {NEWS.map((article) => (
            <article key={article.id} data-fade-item className="h-full">
              <Link
                to={paths.newsArticle(article.id)}
                className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-inv-border bg-white transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
              >
                <span className="block h-48 overflow-hidden bg-inv-surface-1">
                  <img
                    src={newsCover(article.id)}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className={`h-full w-full ${newsCoverFit(article.id)} transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]`}
                  />
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-inv-ink-muted">
                    <span className="tabular-nums">{article.date}</span>
                    <span className="rounded-[4px] border border-inv-border px-2 py-0.5 text-xs font-semibold text-inv-ink">
                      {article.category}
                    </span>
                  </span>

                  <span className="mt-3 block text-lg font-semibold leading-snug text-inv-ink group-hover:text-inv-blue transition-colors duration-[120ms]">
                    {article.title}
                  </span>

                  <span className="mt-2 block text-sm leading-relaxed text-inv-ink-muted line-clamp-3">
                    {excerpt(article)}
                  </span>

                  <span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-inv-blue">
                    Читать полностью
                    <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </article>
          ))}
        </FadeGroup>
      </div>
    </section>
  </>
);
