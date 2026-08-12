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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0B5FA5] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-[#F39200]" />
            <span className="font-extrabold text-sm uppercase tracking-wide">
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
              <h3 className="text-lg font-black text-slate-900">
                Заявка принята!
              </h3>
              <p className="text-xs text-slate-600">
                Специалист ООО «ИНВИТ» перезвонит вам в течение 10 минут.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#0B5FA5] text-white font-bold text-xs px-4 py-2 rounded-lg"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <p className="text-slate-600 text-xs leading-relaxed">
                Оставьте контактный номер телефона для консультации по выбору лент EUROBAND и согласованию оптовых скидок.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ваше имя:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Анатолий"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (29) 000-00-00"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Комментарий / Запрос:
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: заказать прайс или консультацию по ПСУЛ..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#F39200] hover:bg-[#E08200] text-slate-950 font-black py-3 px-4 rounded-xl shadow transition-all flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
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
