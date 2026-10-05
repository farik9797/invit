<?php
/**
 * Окно поиска для узкого экрана. Затемнение само не прокручивается, а карточка
 * ограничена видимой высотой: когда на телефоне вылезает клавиатура, окно
 * ужимается по месту и листается внутри, а не уезжает шапкой за кромку.
 */

if (!defined('ABSPATH')) exit;

$hints = ['ПСУЛ', 'ПЭС', 'Герметики', 'Крепёж', 'Пена', 'Уголки'];
?>
<div data-modal="search" hidden class="fixed inset-0 z-50 bg-inv-deep/55 backdrop-blur-sm">
    <div class="flex min-h-full items-start justify-center px-4 py-6 sm:py-[12vh]">
        <div role="dialog" aria-modal="true" aria-label="Поиск по каталогу" class="relative w-full max-w-[640px] max-h-[calc(100dvh-3rem)] sm:max-h-[76vh] overflow-y-auto overscroll-contain rounded-[8px] bg-white shadow-[0_24px_60px_rgba(10,25,60,0.35)]">
            <button type="button" data-modal-close aria-label="Закрыть поиск" class="absolute top-2 right-2 flex items-center justify-center w-11 h-11 rounded-[4px] text-inv-ink-muted hover:text-inv-ink hover:bg-inv-surface-1 transition-colors cursor-pointer">
                <?php echo invit_icon('x', 'w-5 h-5'); ?>
            </button>

            <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>" class="px-5 pt-6 pb-5 sm:px-7 sm:pt-7">
                <input type="hidden" name="post_type" value="product">
                <span class="block text-xs font-semibold uppercase tracking-[0.14em] text-inv-ink-muted">Поиск по каталогу</span>

                <span class="relative mt-4 block">
                    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-inv-ink-muted">
                        <?php echo invit_icon('search', 'w-5 h-5'); ?>
                    </span>
                    <label class="sr-only" for="modal-search-input">Что ищем</label>
                    <input id="modal-search-input" data-search-input type="search" name="s" placeholder="Лента, ПСУЛ, профиль, крепёж…" class="w-full h-14 pl-12 pr-4 rounded-[4px] border border-inv-border bg-inv-surface-1 text-base sm:text-lg text-inv-ink placeholder:text-inv-ink-muted focus:bg-white focus:border-inv-blue focus-visible:outline-none">
                </span>

                <button type="submit" class="mt-3 w-full inline-flex items-center justify-center gap-2 min-h-11 h-12 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover active:scale-[0.99] text-white text-sm font-semibold transition-[background-color,transform] duration-[120ms] cursor-pointer">
                    <?php echo invit_icon('search', 'w-4 h-4'); ?>
                    Найти в каталоге
                </button>
            </form>

            <div class="px-5 pb-6 pt-4 sm:px-7 border-t border-inv-border-subtle">
                <span class="block text-xs text-inv-ink-muted">Часто ищут</span>
                <div class="mt-2 flex flex-wrap gap-2">
                    <?php foreach ($hints as $hint) : ?>
                        <a href="<?php echo esc_url(add_query_arg(['s' => $hint, 'post_type' => 'product'], home_url('/'))); ?>" class="inline-flex items-center min-h-11 px-4 rounded-[4px] border border-inv-border bg-white text-sm text-inv-ink hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms]">
                            <?php echo esc_html($hint); ?>
                        </a>
                    <?php endforeach; ?>
                </div>

                <p class="mt-4 pt-4 border-t border-inv-border-subtle text-xs text-inv-ink-muted">
                    Ищем по названию и артикулу. Закрыть: <kbd class="px-1.5 py-0.5 rounded-[3px] border border-inv-border bg-inv-surface-1 font-sans">Esc</kbd>
                </p>
            </div>
        </div>
    </div>
</div>
