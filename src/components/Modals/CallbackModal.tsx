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
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Метка «откуда открыли окно» (шапка, главная, карточка товара) — служебная:
  // в поле комментария её видел посетитель и отправлял как свой текст. Поле
  // теперь пустое, а метка уходит с заявкой скрытым полем source.
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl max-w-md w-full shadow-lg border border-line overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-white" />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Обратный звонок / консультация
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[4px] hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-ink">
                Заявка принята!
              </h3>
              <p className="text-xs text-ink/70">
                Специалист ООО «ИНВИТ» перезвонит вам в течение 10 минут.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-brand-blue text-white font-bold text-xs px-4 py-2 rounded-[4px]"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <input type="hidden" name="source" value={customNote || ''} />
              <p className="text-ink/70 text-xs leading-relaxed">
                Оставьте контактный номер телефона для консультации по выбору лент EUROBAND и согласованию оптовых скидок.
              </p>

              <div>
                <label className="block font-bold text-ink/80 mb-1">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Анатолий"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium"
                />
              </div>

              {/* Компания — обязательное: заявки принимаем от юрлиц и ИП,
                  по названию менеджер находит клиента в учёте. */}
              <div>
                <label className="block font-bold text-ink/80 mb-1">
                  Компания <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ООО «Вектор» или ИП Иванов И. И."
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/80 mb-1">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (29) 000-00-00"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/80 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@company.by"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-ink/80 mb-1">
                  Комментарий / запрос
                </label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Например: запросить прайс или консультацию по ПСУЛ…"
                  className="w-full p-2.5 bg-surface-soft border border-line rounded-[4px] text-ink font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 px-4 rounded-[4px] shadow transition-all flex items-center justify-center gap-2  cursor-pointer"
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
