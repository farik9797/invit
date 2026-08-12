import React from 'react';
import { X, Calendar, Newspaper, ArrowLeft } from 'lucide-react';
import { NewsArticle } from '../../types';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-white" />
            <span className="font-extrabold text-xs uppercase tracking-wide">
              Пресс-релиз ООО «ИНВИТ»
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="bg-brand-red text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded">
              {article.category}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-brand-blue" />
              {article.date}
            </span>
          </div>

          <h2 className="text-xl font-black text-slate-900 leading-snug">
            {article.title}
          </h2>

          <div className="rounded-xl overflow-hidden border border-slate-200 h-60 bg-slate-900">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-sm font-semibold text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            {article.summary}
          </p>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2 pt-1">
            <p>{article.content}</p>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 font-semibold">
              ООО «ИНВИТ» — Пресс-служба EUROBAND
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-blue text-white font-bold text-xs uppercase rounded-lg hover:bg-brand-blue-hover transition-colors"
            >
              Вернуться назад
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
