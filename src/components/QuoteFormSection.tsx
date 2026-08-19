import React, { useState } from 'react';
import { Send, FileText, Upload, CheckCircle2, PhoneCall, Building, ShieldCheck, Mail } from 'lucide-react';

interface QuoteFormSectionProps {
  initialNote?: string;
}

export const QuoteFormSection: React.FC<QuoteFormSectionProps> = ({ initialNote = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    unp: '',
    phone: '',
    email: '',
    city: 'Минск',
    comment: initialNote || '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.name) return;
    setSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <section id="contacts" className="py-14 bg-brand-navy text-white relative">
      <div className="max-w-[1340px] mx-auto px-5">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text & Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-red text-white font-semibold text-sm px-3 py-1 rounded shadow">
              <PhoneCall className="w-4 h-4" />
              <span>Прямое сотрудничество с заводом</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
              Начнём сотрудничество?
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Отправьте карточку предприятия или спецификацию проекта. Наш инженер коммерческого отдела рассчитает персональные цены с учетом оптовых скидок в течение 30 минут.
            </p>

            {/* Benefit Bullets */}
            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-brand-red text-white rounded shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-white">Персональный менеджер B2B</strong>
                  <span className="text-brand-navy/40">Закрепленный специалист по объектам и опту</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-brand-red text-white rounded shrink-0 mt-0.5">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-white">Выписка ТТН прямо на складе</strong>
                  <span className="text-brand-navy/40">Минск, ТЦ Сеница (пересечение МКАД)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-brand-red text-white rounded shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block font-bold text-white">Полная отсрочка для постоянных партнеров</strong>
                  <span className="text-brand-navy/40">Индивидуальные условия оплаты для строительных трестов</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/15 space-y-2">
              <span className="block text-xs text-brand-navy/45 font-mono uppercase">Прямой номер отдела продаж:</span>
              <a
                href="tel:+375296444979"
                className="text-xl font-bold text-brand-red-light hover:text-white transition-colors block"
              >
                +375 (29) 644-49-79
              </a>
              <span className="text-xs text-brand-navy/40 block">
                Email: <a href="mailto:info@invit.by" className="text-blue-300 underline font-semibold">info@invit.by</a>
              </span>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-white text-brand-navy rounded-xl p-6 sm:p-8 shadow-lg border border-line">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy">
                  Заявка на КП успешно принята!
                </h3>
                <p className="text-brand-navy/70 text-sm max-w-md mx-auto">
                  Спасибо, {formData.name}. Специалист отдела продаж ООО «ИНВИТ» свяжется с вами по номеру <strong className="text-brand-blue">{formData.phone}</strong> для передачи оптового прайс-листа и договора.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-blue text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
                >
                  Отправить еще одну заявку
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-line pb-3 mb-2">
                  <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-blue" />
                    Запрос Коммерческого Предложения (КП)
                  </h3>
                  <p className="text-xs text-brand-navy/55">
                    Заполните форму для получения оптовых цен производителя ООО «ИНВИТ»
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      ФИО контактного лица <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Иван Петров"
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      Телефон для связи <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+375 (29) 000-00-00"
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      Название компании / ИП:
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="ООО «СтройМонтаж»"
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      УНП (для договора):
                    </label>
                    <input
                      type="text"
                      value={formData.unp}
                      onChange={(e) => setFormData({ ...formData, unp: e.target.value })}
                      placeholder="УНП организации"
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      Email для отправки КП:
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="zakaz@company.by"
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-brand-navy/80 mb-1">
                      Город / Регион доставки:
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="г. Минск, Брест, Гродно..."
                      className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-brand-navy/80 mb-1">
                    Перечень позиций / Спецификация / Сообщение:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Укажите ширины, намотку, объем (например: Лента EUROBAND Внутренняя 70мм — 200 рулонов, ПСУЛ 15/4 — 50 рулонов)..."
                    className="w-full p-2.5 bg-surface-soft border border-line rounded-lg text-brand-navy font-medium"
                  ></textarea>
                </div>

                {/* File Upload Attachment */}
                <div className="p-3 bg-surface-soft rounded-xl border border-dashed border-line flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-semibold text-brand-navy/80">
                      {fileName ? fileName : 'Прикрепить реквизиты / ТЗ (.PDF, .XLSX, .DOC)'}
                    </span>
                  </div>
                  <label className="bg-brand-blue hover:bg-brand-blue-hover text-white text-[11px] font-bold px-3 py-1.5 rounded cursor-pointer transition-colors">
                    Обзор
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.xlsx,.xls,.doc,.docx"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Отправить заявку в отдел продаж ИНВИТ</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
