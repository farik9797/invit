import React from 'react';
import { Award, FileText, CheckCircle, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { CERTIFICATES } from '../data/catalogData';
import { CertificateItem } from '../types';

interface CertificatesSectionProps {
  onSelectCertificate: (cert: CertificateItem) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({ onSelectCertificate }) => {
  return (
    <section id="certificates" className="py-12 bg-surface-soft border-b border-line">
      <div className="max-w-[1340px] mx-auto px-5">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold  text-brand-blue mb-1">
              <ShieldCheck className="w-4 h-4 text-brand-red" />
              <span>Официальная декларация & Гарантия СТБ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight">
              Сертификаты качества продукции EUROBAND
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-brand-navy/70 max-w-md">
            Вся продукция ООО «ИНВИТ» под маркой EUROBAND имеет необходимые документы по качеству:
            технические свидетельства, декларации о соответствии, сертификат продукции собственного
            производства и паспорта качества.
          </p>
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onSelectCertificate(cert)}
              className="bg-white rounded-xl border border-line shadow-sm hover:shadow-sm hover:border-brand-sky transition-all duration-300 p-4 flex flex-col justify-between cursor-pointer group"
            >
              {/* Скан документа */}
              <div className="relative h-56 bg-white rounded-lg overflow-hidden border border-line flex items-center justify-center p-2 mb-3">
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded"
                />
                <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/35 transition-colors flex items-center justify-center">
                  <span className="bg-brand-blue text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow uppercase flex items-center gap-1 group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Просмотр</span>
                  </span>
                </div>
              </div>

              {/* Document Metadata */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-brand-blue  block">
                    {cert.type}
                  </span>
                  <h3 className="text-xs font-semibold text-brand-navy line-clamp-2 mt-0.5 group-hover:text-brand-blue transition-colors">
                    {cert.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-line text-[11px] text-brand-navy/55 space-y-1">
                  {cert.issuedBy && (
                    <div className="flex justify-between">
                      <span>Выдан:</span>
                      <span className="font-semibold text-brand-navy/80 truncate max-w-[120px]">
                        {cert.issuedBy}
                      </span>
                    </div>
                  )}
                  {cert.validUntil ? (
                    <div className="flex justify-between">
                      <span>Срок действия:</span>
                      <span className="font-bold text-emerald-700">до {cert.validUntil}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-brand-navy/55">
                      <FileText className="w-3.5 h-3.5 text-brand-navy/45" />
                      <span>Открыть скан документа</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logos & Quality Standards Trust Strip */}
        <div className="mt-10 p-6 bg-white rounded-xl border border-line shadow-sm flex flex-wrap items-center justify-around gap-6 text-brand-navy/45">
          <div className="flex items-center gap-2 font-bold text-brand-navy/80 text-sm">
            <Award className="w-5 h-5 text-brand-red" />
            <span>Сертификат собственного производства</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-brand-navy/80 text-sm">
            <ShieldCheck className="w-5 h-5 text-brand-blue" />
            <span>Свидетельство технической компетентности</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-brand-navy/80 text-sm">
            <FileText className="w-5 h-5 text-brand-blue" />
            <span>Технические свидетельства</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-brand-navy/80 text-sm">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Декларации о соответствии</span>
          </div>
        </div>

      </div>
    </section>
  );
};
