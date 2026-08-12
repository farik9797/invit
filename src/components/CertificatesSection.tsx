import React from 'react';
import { Award, FileText, CheckCircle, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { CERTIFICATES } from '../data/catalogData';
import { CertificateItem } from '../types';

interface CertificatesSectionProps {
  onSelectCertificate: (cert: CertificateItem) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ onSelectCertificate }) => {
  return (
    <section id="certificates" className="py-12 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B5FA5] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#F39200]" />
              <span>Официальная декларация & Гарантия СТБ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Сертификаты качества продукции EUROBAND
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Все материалы ООО «ИНВИТ» сертифицированы в органах РУП «Стройтехнорм», Госстандарта и БелТПП для применения в капитальном строительстве.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onSelectCertificate(cert)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer group"
            >
              {/* Document Mockup Thumbnail */}
              <div className="relative h-44 bg-slate-50 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center p-2 mb-3">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <span className="bg-[#0B5FA5] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow uppercase flex items-center gap-1 group-hover:bg-[#F39200] group-hover:text-slate-950 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Просмотр</span>
                  </span>
                </div>
              </div>

              {/* Document Metadata */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#0B5FA5] uppercase tracking-wider block">
                    {cert.type}
                  </span>
                  <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 mt-0.5 group-hover:text-[#0B5FA5] transition-colors">
                    {cert.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Выдан:</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">{cert.issuedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Срок действия:</span>
                    <span className="font-bold text-emerald-700">до {cert.validUntil}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos & Quality Standards Trust Strip */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-around gap-6 text-slate-400">
          <div className="flex items-center gap-2 font-black text-slate-700 text-sm">
            <Award className="w-5 h-5 text-[#F39200]" />
            <span>СТБ 1488-2004</span>
          </div>
          <div className="flex items-center gap-2 font-black text-slate-700 text-sm">
            <ShieldCheck className="w-5 h-5 text-[#0B5FA5]" />
            <span>ГОСТ РБ</span>
          </div>
          <div className="flex items-center gap-2 font-black text-slate-700 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>БелТПП №2025</span>
          </div>
          <div className="flex items-center gap-2 font-black text-slate-700 text-sm">
            <FileText className="w-5 h-5 text-[#0B5FA5]" />
            <span>Декларация ТР ТС ЕАЭС</span>
          </div>
        </div>

      </div>
    </section>
  );
};
