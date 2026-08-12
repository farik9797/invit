import React from 'react';
import { Newspaper, Calendar, ArrowRight, Tag } from 'lucide-react';
import { NEWS } from '../data/catalogData';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  onSelectNews: (article: NewsArticle) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectNews }) => {
  return (
    <section id="news" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5FA5] mb-1">
              <Newspaper className="w-4 h-4 text-[#F39200]" />
              <span>Новости компании ИНВИТ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              События, сертификаты & обновления производства
            </h2>
          </div>
          <button
            onClick={() => onSelectNews(NEWS[0])}
            className="text-xs font-bold text-[#0B5FA5] hover:text-[#1A6DB5] flex items-center gap-1 uppercase tracking-wider cursor-pointer"
          >
            <span>Все новости & пресс-релизы</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* News 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <span className="absolute top-3 left-3 bg-[#0B5FA5] text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded shadow">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#F39200]" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-[#0B5FA5] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-[#0B5FA5]">
                  <span>Читать полностью</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
