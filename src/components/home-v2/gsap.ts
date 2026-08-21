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

export { gsap, ScrollTrigger };
