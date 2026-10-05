<?php
/**
 * Колонка разделов каталога. Выбранный раздел — красный, под курсором строка
 * заливается синим; подразделы раскрыты только у открытого раздела, иначе
 * список на тринадцать разделов занимал бы два экрана.
 */

if (!defined('ABSPATH')) exit;

$sections = invit_catalog_sections();
if (!$sections) return;

$current = is_product_category() ? get_queried_object() : null;
$current_id = $current ? (int) $current->term_id : 0;
$current_parent = $current ? (int) $current->parent : 0;

$shop_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/');
$total = wp_count_posts('product')->publish;

$row = 'flex items-center gap-2.5 min-h-11 px-2.5 rounded-[4px] text-sm transition-colors duration-[120ms]';
$idle = 'text-inv-ink hover:bg-inv-blue hover:text-white';
$active = 'bg-inv-surface-1 text-inv-red font-semibold';
?>
<aside class="rounded-[8px] border border-inv-border bg-white overflow-hidden">
    <h2 class="bg-inv-surface-1 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-inv-ink-muted border-b border-inv-border">
        Разделы
    </h2>

    <nav class="p-2" aria-label="Разделы каталога">
        <a href="<?php echo esc_url($shop_url); ?>" class="<?php echo esc_attr($row . ' ' . ($current ? $idle : $active)); ?>">
            <span class="flex-1">Все позиции</span>
            <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo esc_html($total); ?></span>
        </a>

        <?php foreach ($sections as $section) :
            $is_open = $current_id === (int) $section->term_id || $current_parent === (int) $section->term_id;
            $children = $is_open ? invit_catalog_children($section->term_id) : [];
            ?>
            <div class="mt-0.5">
                <a href="<?php echo esc_url(get_term_link($section)); ?>" class="<?php echo esc_attr($row . ' ' . ($is_open ? $active : $idle)); ?>">
                    <span class="flex-1 leading-snug"><?php echo esc_html($section->name); ?></span>
                    <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo esc_html($section->count); ?></span>
                </a>

                <?php if ($children) : ?>
                    <ul class="mt-0.5 mb-1 ml-2.5 pl-3 border-l border-inv-border space-y-0.5">
                        <?php foreach ($children as $child) :
                            $child_active = $current_id === (int) $child->term_id;
                            ?>
                            <li>
                                <a href="<?php echo esc_url(get_term_link($child)); ?>" class="flex items-center gap-2 min-h-10 px-2 py-1 rounded-[4px] text-[13px] leading-snug transition-colors duration-[120ms] <?php echo $child_active ? 'text-inv-red font-semibold' : 'text-inv-ink hover:bg-inv-blue hover:text-white'; ?>">
                                    <span class="flex-1"><?php echo esc_html($child->name); ?></span>
                                    <span class="text-xs text-inv-ink-muted tabular-nums"><?php echo esc_html($child->count); ?></span>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </nav>
</aside>
