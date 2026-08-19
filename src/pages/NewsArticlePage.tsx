import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NEWS } from '../data/catalogData';
import { paths } from '../routes';

export const NewsArticlePage: React.FC = () => {
  const { newsId } = useParams();
  const article = NEWS.find((n) => n.id === newsId);

  if (!article) return <Navigate to={paths.news} replace />;

  const others = NEWS.filter((n) => n.id !== article.id).slice(0, 2);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Новости', to: paths.news }, { label: article.title }]} />

      <article className="max-w-[900px] mx-auto px-5 py-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-brand-red text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-navy/55 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-brand-red" />
              {article.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight leading-snug">
            {article.title}
          </h1>
          <p className="text-base text-brand-navy/70 leading-relaxed font-medium">{article.summary}</p>
        </div>

        <img
          src={article.image}
          alt={article.title}
          className="w-full max-h-96 object-contain bg-white rounded-xl border border-line p-4"
        />

        <div className="text-sm text-brand-navy/80 leading-relaxed space-y-4">
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <Link
          to={paths.news}
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors pt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Все новости</span>
        </Link>
      </article>

      {others.length > 0 && (
        <section className="py-12 bg-white border-t border-line">
          <div className="max-w-[900px] mx-auto px-5 space-y-5">
            <h2 className="text-lg font-bold text-brand-navy tracking-tight">Другие новости</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {others.map((n) => (
                <Link
                  key={n.id}
                  to={paths.newsArticle(n.id)}
                  className="flex gap-3 p-3 rounded-xl border border-line hover:border-brand-sky hover:shadow-xs transition-all group"
                >
                  <img
                    src={n.image}
                    alt={n.title}
                    className="w-20 h-20 object-contain bg-white border border-line rounded-xl shrink-0 p-1.5"
                  />
                  <div className="min-w-0 space-y-1">
                    <span className="text-[11px] text-brand-navy/45 font-semibold">{n.date}</span>
                    <span className="block text-xs font-semibold text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-3 leading-snug">
                      {n.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
