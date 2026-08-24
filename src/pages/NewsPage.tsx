import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Fade, FadeGroup } from '../components/home-v2/Chrome';
import { NEWS } from '../data/catalogData';
import { paths } from '../routes';

/*
 * Новости. Прежняя версия показывала к каждой заметке «фото» с invit.by, но это
 * не фотографии, а клипарт нулевых: эмблема палаты, картинка телефона, красная
 * печать «важная информация», кубики со скидками. Рядом с настоящими фото лент
 * они выглядели чужеродно, поэтому картинок здесь нет вовсе: у шести заметок
 * есть дата, тема и текст, этого достаточно.
 */

const WRAP = 'max-w-[1400px] mx-auto px-4 lg:px-8';

/** Первая заметка идёт крупно: она про действующий сертификат производства. */
const [LEAD, ...REST] = NEWS;

/**
 * `summary` в данных обрезан на полуслове ещё при выгрузке с invit.by,
 * поэтому во всех анонсах берём первый абзац `content`: он заканчивается точкой.
 */
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
        {/* Свежая заметка занимает всю ширину: так виден действующий сертификат */}
        <Fade>
          <Link
            to={paths.newsArticle(LEAD.id)}
            className="group block rounded-[8px] border border-inv-border bg-inv-surface-1 p-6 sm:p-8 lg:p-10 transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
          >
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-inv-ink-muted">
              <span className="tabular-nums">{LEAD.date}</span>
              <span className="rounded-[4px] bg-white border border-inv-border px-2 py-0.5 text-xs font-semibold text-inv-ink">
                {LEAD.category}
              </span>
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-inv-ink leading-snug tracking-[-0.01em] max-w-[34ch] group-hover:text-inv-blue transition-colors duration-[120ms]">
              {LEAD.title}
            </h2>

            <p className="mt-4 text-base leading-[1.55] text-inv-ink-muted line-clamp-3 max-w-[70ch]">
              {excerpt(LEAD)}
            </p>

            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-inv-blue">
              Читать полностью
              <ArrowRight className="w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1" />
            </span>
          </Link>
        </Fade>

        {/* Остальные — списком: у заметок разная длина, сетка карточек рвалась бы */}
        <FadeGroup className="mt-8 sm:mt-10">
          <ul className="divide-y divide-inv-border border-t border-inv-border">
            {REST.map((article) => (
              <li key={article.id} data-fade-item>
                <Link
                  to={paths.newsArticle(article.id)}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-8 py-6 sm:py-7 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
                >
                  <span className="md:col-span-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-inv-ink-muted">
                    <span className="tabular-nums">{article.date}</span>
                    <span className="md:hidden">{article.category}</span>
                  </span>

                  <span className="md:col-span-7">
                    <span className="block text-lg font-semibold text-inv-ink leading-snug group-hover:text-inv-blue transition-colors duration-[120ms]">
                      {article.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-inv-ink-muted line-clamp-2 max-w-[70ch]">
                      {excerpt(article)}
                    </span>
                  </span>

                  <span className="hidden md:block md:col-span-2 text-sm text-inv-ink-muted md:text-right">
                    {article.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FadeGroup>
      </div>
    </section>
  </>
);
