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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0B5FA5] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F39200]" />
            <span className="font-extrabold text-xs uppercase tracking-wide">
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
          <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 h-72 flex items-center justify-center p-2">
            <img
              src={certificate.image}
              alt={certificate.title}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {certificate.title}
            </h3>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Орган сертификации:</span>
                <span className="font-bold text-slate-900">{certificate.issuedBy}</span>
              </div>
              <div className="flex justify-between">
                <span>Срок действия:</span>
                <span className="font-bold text-emerald-700">до {certificate.validUntil}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase rounded-lg"
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
