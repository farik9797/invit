<?php
/** Пустая заявка: не тупик, а приглашение вернуться в каталог. */

if (!defined('ABSPATH')) exit;
?>
<div class="rounded-[8px] border border-inv-border bg-inv-surface-1 px-5 py-10 text-center">
    <p class="text-base text-inv-ink">В заявке пока ничего нет.</p>
    <p class="mt-2 text-sm text-inv-ink-muted">
        Наберите позиции в каталоге — по ним менеджер выставит счёт-фактуру.
    </p>

    <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms]">
            Перейти в каталог
        </a>
        <button type="button" data-request class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms] cursor-pointer">
            Запросить расчёт
        </button>
    </div>
</div>
