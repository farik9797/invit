import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
 * Анимации второго варианта главной сделаны на GSAP.
 * Основной сайт остаётся на motion — библиотеки не смешиваются в одном дереве:
 * всё, что под /v2, анимирует только GSAP.
 *
 * Тайминг из дизайн-системы Amex: 240 мс, cubic-bezier(0.4, 0, 0.2, 1).
 */
gsap.registerPlugin(ScrollTrigger);

export const AMEX_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
export const AMEX_DURATION = 0.24;

/** Пользователь мог попросить систему не анимировать. Тогда просто ничего не двигаем. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Параллакс, привязанный к прокрутке: элементы внутри секции едут медленнее
 * или быстрее страницы. Селекторы ищутся только внутри возвращённого ref.
 */
export const useScrollParallax = (targets: { selector: string; yPercent: number }[]) => {
  const ref = useRef<HTMLDivElement>(null);
  const key = JSON.stringify(targets);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      targets.forEach(({ selector, yPercent }) => {
        gsap.to(selector, {
          yPercent,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }, el);

    return () => ctx.revert();
    // targets приходят литералом на каждый рендер, поэтому сравниваем по содержимому
  }, [key]);

  return ref;
};

export { gsap, ScrollTrigger };
