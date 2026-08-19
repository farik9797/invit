import React from 'react';
import { X, Award, ExternalLink, ShieldCheck, Download } from 'lucide-react';
import { CertificateItem } from '../../types';

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl max-w-xl w-full shadow-lg border border-line overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm">
              {certificate.type}
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
        <div className="p-6 space-y-4">
          <div className="bg-white rounded-xl overflow-hidden border border-line h-[420px] flex items-center justify-center p-2">
            <img
              src={certificate.imageFull || certificate.image}
              alt={certificate.title}
              className="w-full h-full object-contain rounded"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-brand-navy leading-snug">
              {certificate.title}
            </h3>
            {(certificate.issuedBy || certificate.validUntil) && (
              <div className="mt-2 p-3 bg-surface-soft border border-line rounded-lg text-xs space-y-1 text-brand-navy/70">
                {certificate.issuedBy && (
                  <div className="flex justify-between">
                    <span>Орган сертификации:</span>
                    <span className="font-bold text-brand-navy">{certificate.issuedBy}</span>
                  </div>
                )}
                {certificate.validUntil && (
                  <div className="flex justify-between">
                    <span>Срок действия:</span>
                    <span className="font-bold text-emerald-700">до {certificate.validUntil}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-between items-center gap-2">
            <a
              href={certificate.imageFull || certificate.image}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Открыть оригинал</span>
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-soft hover:bg-surface-soft text-brand-navy font-semibold text-sm rounded-lg cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
