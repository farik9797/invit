import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Breadcrumbs, PageHeading } from '../components/Breadcrumbs';
import { NEWS } from '../data/catalogData';
import { paths } from '../routes';

export const NewsPage: React.FC = () => (
  <>
    <Breadcrumbs items={[{ label: 'Новости' }]} />
    <PageHeading
      eyebrow="Новости компании"
      title="События, сертификаты и обновления производства"
      description="Что происходит в ООО «ИНВИТ»: подтверждение статуса производителя, развитие производственной базы, изменения в работе офиса и склада."
    />

    <section className="max-w-[1340px] mx-auto px-5 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NEWS.map((article) => (
          <article
            key={article.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group"
          >
            <Link to={paths.newsArticle(article.id)} className="block relative h-44 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md">
                {article.category}
              </span>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-brand-red" />
                  <span>{article.date}</span>
                </div>
                <Link
                  to={paths.newsArticle(article.id)}
                  className="block text-sm font-extrabold text-slate-900 hover:text-brand-blue transition-colors leading-snug"
                >
                  {article.title}
                </Link>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <Link
                to={paths.newsArticle(article.id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
              >
                <span>Читать полностью</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);
