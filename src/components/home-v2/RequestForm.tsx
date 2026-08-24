import React, { useEffect, useRef, useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';

/*
 * Форма запроса расчёта. Одна на весь сайт: стоит и на главной варианта 2,
 * и на странице контактов, поэтому валидация живёт в одном месте.
 *
 * Бэкенда пока нет: заявка никуда не уходит, показываем подтверждение.
 * Когда появится приёмник, менять надо только `submit`.
 */

const FIELD =
  'w-full min-h-11 px-3 py-2.5 rounded-[4px] border bg-white text-base text-inv-ink placeholder:text-inv-ink-muted transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue';

interface Props {
  /** Префикс для id полей: на странице может быть больше одной формы. */
  idPrefix?: string;
}

export const RequestForm: React.FC<Props> = ({ idPrefix = 'zayavka' }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [task, setTask] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: { name?: string; phone?: string } = {};
    if (!name.trim()) next.name = 'Укажите, как к вам обращаться';
    if (phone.replace(/\D/g, '').length < 9) next.phone = 'Введите номер телефона полностью';
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus('sending');
    timer.current = window.setTimeout(() => setStatus('done'), 600);
  };

  if (status === 'done') {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-inv-success/10">
          <Check className="w-6 h-6 text-inv-success" />
        </span>
        <h3 className="text-xl font-semibold text-inv-ink">Заявка принята</h3>
        <p className="text-base text-inv-ink-muted max-w-[46ch]">
          Перезвоним в рабочее время: пн-чт с 9:00 до 17:30, пт с 9:00 до 16:00.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="min-h-11 text-sm font-semibold text-inv-blue cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Отправить ещё одну
        </button>
      </div>
    );
  }

  const id = (field: string) => `${idPrefix}-${field}`;

  return (
    <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor={id('name')} className="text-sm font-semibold text-inv-ink">
          Имя
        </label>
        <input
          id={id('name')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? id('name-error') : undefined}
          className={`${FIELD} ${errors.name ? 'border-inv-error' : 'border-inv-border'}`}
        />
        {errors.name && (
          <p id={id('name-error')} className="flex items-center gap-1.5 text-sm text-inv-error">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={id('company')} className="text-sm font-semibold text-inv-ink">
          Компания
        </label>
        <input
          id={id('company')}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={`${FIELD} border-inv-border`}
        />
        <p className="text-sm text-inv-ink-muted">Необязательно</p>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor={id('phone')} className="text-sm font-semibold text-inv-ink">
          Телефон
        </label>
        <input
          id={id('phone')}
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? id('phone-error') : id('phone-hint')}
          className={`${FIELD} ${errors.phone ? 'border-inv-error' : 'border-inv-border'}`}
        />
        {errors.phone ? (
          <p id={id('phone-error')} className="flex items-center gap-1.5 text-sm text-inv-error">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.phone}
          </p>
        ) : (
          <p id={id('phone-hint')} className="text-sm text-inv-ink-muted">
            Например, +375 29 000-00-00
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor={id('task')} className="text-sm font-semibold text-inv-ink">
          Что нужно
        </label>
        <textarea
          id={id('task')}
          rows={3}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className={`${FIELD} border-inv-border resize-y`}
        />
        <p className="text-sm text-inv-ink-muted">
          Тип ленты, ширина и толщина, объём в метрах или рулонах.
        </p>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 px-8 rounded-[4px] bg-inv-blue text-white text-sm font-semibold cursor-pointer transition-[background-color,transform] duration-[120ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-inv-blue-hover active:bg-inv-blue-pressed active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          {status === 'sending' ? 'Отправляем' : 'Запросить расчёт'}
        </button>
      </div>
    </form>
  );
};
