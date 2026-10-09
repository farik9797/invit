<?php
/**
 * Плашка о cookie: согласие на счётчики (Яндекс.Метрика, Google Analytics).
 * Скрыта, пока site.js не проверит cookie invit_consent: выбора нет — показывает.
 * «Принять» включает счётчики (invit_counters в functions.php), «Отклонить» —
 * остаются только служебные cookie. Сменить выбор — кнопка в политике
 * конфиденциальности ([data-cookie-settings]).
 */

if (!defined('ABSPATH')) exit;

$link = 'text-inv-blue hover:text-inv-blue-pressed underline-offset-2 hover:underline transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue';
?>
<div data-cookie-banner hidden role="region" aria-label="Согласие на cookie" class="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:left-6 sm:bottom-6 z-50 sm:max-w-[420px] rounded-[8px] border border-inv-border bg-white p-5 shadow-[0_12px_40px_rgba(22,44,88,0.18)] opacity-0 translate-y-3 transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
    <p class="text-[15px] font-semibold text-inv-ink">Мы используем cookie</p>
    <p class="mt-2 text-sm leading-relaxed text-inv-ink-muted">
        Служебные cookie нужны, чтобы работала заявка. С вашего согласия включим
        Яндекс.Метрику и Google Analytics — они показывают, что на сайте удобно,
        а что нет.
        <a href="<?php echo esc_url(home_url('/privacy/')); ?>" class="<?php echo esc_attr($link); ?>">Подробнее</a>
    </p>
    <div class="mt-4 flex gap-3">
        <button type="button" data-cookie-choice="all" class="<?php echo esc_attr(invit_blue_button('flex-1')); ?>">Принять</button>
        <button type="button" data-cookie-choice="necessary" class="<?php echo esc_attr(invit_button_base() . ' flex-1 bg-inv-surface-1 text-inv-ink hover:bg-inv-surface-2 focus-visible:outline-inv-blue'); ?>">Отклонить</button>
    </div>
</div>
