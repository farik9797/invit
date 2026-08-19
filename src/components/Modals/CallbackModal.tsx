import React, { useState } from 'react';
import { X, Send, PhoneCall, CheckCircle2 } from 'lucide-react';

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  customNote?: string;
}

export const CallbackModal: React.FC<CallbackModalProps> = ({ isOpen, onClose, customNote }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState(customNote || '');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl max-w-md w-full shadow-lg border border-line overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Заказать звонок / Консультацию
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-brand-navy">
                Заявка принята!
              </h3>
              <p className="text-xs text-brand-navy/70">
                Специалист ООО «ИНВИТ» перезвонит вам в течение 10 минут.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-brand-blue text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-brand-navy/70 text-xs leading-relaxed">
                Оставьте контактный номер телефона для консультации по выбору лент EUROBAND и согласованию оптовых скидок.
              </p>

              <div>
                <label className="block font-bold text-brand-navy/80 mb-1">
                  Ваше имя:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Анатолий"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy/80 mb-1">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (29) 000-00-00"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-navy/80 mb-1">
                  Комментарий / Запрос:
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: заказать прайс или консультацию по ПСУЛ..."
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2  cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Жду звонка инженера</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
