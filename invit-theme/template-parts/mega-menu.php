<?php
/**
 * Кнопка «Каталог товаров» с выпадающим меню: слева разделы, справа подразделы
 * того, на который навели. Панель просвечивает — приём с сайта, который показал
 * клиент: сквозь белый на 92% видно страницу под меню.
 *
 * @var array $args ['sections' => WP_Term[]]
 */

if (!defined('ABSPATH')) exit;

$sections = $args['sections'] ?? [];
if (!$sections) return;

$children = [];
foreach ($sections as $section) {
    $children[$section->term_id] = invit_catalog_children($section->term_id);
}
?>
<div class="relative" data-mega>
    <button
        type="button"
        data-mega-toggle
        aria-expanded="false"
        aria-controls="mega-menu"
        class="inline-flex items-center gap-2 min-h-11 px-3 xl:px-4 rounded-[4px] bg-inv-blue hover:bg-inv-red text-white text-sm font-semibold transition-colors duration-[120ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
    >
        <?php echo invit_icon('menu', 'w-4 h-4'); ?>
        Каталог товаров
        <?php echo invit_icon('chevron-down', 'w-4 h-4'); ?>
    </button>

    <div id="mega-menu" data-mega-panel hidden class="absolute left-0 top-full z-40 pt-3 w-[900px] xl:w-[1100px]">
        <div class="flex rounded-[8px] border border-inv-border bg-white/92 backdrop-blur-md shadow-[0_6px_24px_rgba(22,44,88,0.16)] overflow-hidden">
            <ul class="w-[350px] shrink-0 border-r border-inv-border bg-inv-surface-1/70 py-2 max-h-[70vh] overflow-y-auto">
                <?php foreach ($sections as $index => $section) : ?>
                    <li>
                        <a
                            href="<?php echo esc_url(get_term_link($section)); ?>"
                            data-mega-section="<?php echo esc_attr($section->term_id); ?>"
                            class="flex items-center gap-3 min-h-12 px-5 text-[15px] text-inv-ink transition-colors duration-[120ms] data-[active=true]:bg-inv-blue data-[active=true]:text-white"
                            <?php echo $index === 0 ? 'data-active="true"' : ''; ?>
                        >
                            <span class="flex-1"><?php echo esc_html($section->name); ?></span>
                            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo esc_html($section->count); ?></span>
                            <?php echo invit_icon('chevron-right', 'w-4 h-4 shrink-0 opacity-60'); ?>
                        </a>
                    </li>
                <?php endforeach; ?>
            </ul>

            <div class="flex-1 p-6 max-h-[70vh] overflow-y-auto">
                <?php foreach ($sections as $index => $section) : ?>
                    <div data-mega-panel-for="<?php echo esc_attr($section->term_id); ?>" <?php echo $index === 0 ? '' : 'hidden'; ?>>
                        <a href="<?php echo esc_url(get_term_link($section)); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                            <?php echo esc_html($section->name); ?>
                            <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                        </a>

                        <?php if (!empty($children[$section->term_id])) : ?>
                            <ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
                                <?php foreach ($children[$section->term_id] as $child) : ?>
                                    <li>
                                        <a href="<?php echo esc_url(get_term_link($child)); ?>" class="flex items-center gap-2 min-h-10 px-2 -mx-2 rounded-[4px] text-[13px] leading-snug text-inv-ink hover:bg-inv-blue hover:text-white transition-colors duration-[120ms]">
                                            <span class="flex-1"><?php echo esc_html($child->name); ?></span>
                                            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo esc_html($child->count); ?></span>
                                        </a>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
