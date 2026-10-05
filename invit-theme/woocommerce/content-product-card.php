<?php
/**
 * Карточка товара в списках: снимок, раздел, название, бренд, цена и кнопки.
 * Цены у половины позиций нет — тогда вместо суммы стоит «Цена по запросу».
 */

if (!defined('ABSPATH')) exit;

global $product;

if (!$product || !$product->is_visible()) return;

$terms = get_the_terms(get_the_ID(), 'product_cat');
$section = $terms && !is_wp_error($terms) ? end($terms) : null;
$brand = $product->get_attribute('Бренд');
?>
<div class="group h-full flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
    <a href="<?php the_permalink(); ?>" class="flex items-center justify-center h-[150px] sm:h-[180px] bg-white p-3">
        <?php if (has_post_thumbnail()) : ?>
            <?php the_post_thumbnail('woocommerce_thumbnail', ['class' => 'max-h-full w-auto object-contain', 'loading' => 'lazy']); ?>
        <?php else : ?>
            <span class="text-inv-border"><?php echo invit_icon('layers', 'w-10 h-10'); ?></span>
        <?php endif; ?>
    </a>

    <div class="flex-1 flex flex-col px-4 pb-4">
        <?php if ($section) : ?>
            <a href="<?php echo esc_url(get_term_link($section)); ?>" class="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                <?php echo esc_html($section->name); ?>
            </a>
        <?php endif; ?>

        <a href="<?php the_permalink(); ?>" class="mt-1.5 block text-sm font-semibold leading-snug text-inv-ink group-hover:text-inv-blue transition-colors duration-[120ms]">
            <?php the_title(); ?>
        </a>

        <?php if ($brand) : ?>
            <span class="mt-1 block text-xs text-inv-ink-muted">Бренд: <?php echo esc_html($brand); ?></span>
        <?php endif; ?>

        <div class="mt-auto pt-3 flex items-center justify-between gap-2">
            <span class="text-sm font-semibold text-inv-ink"><?php echo wp_kses_post($product->get_price_html()); ?></span>

            <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" data-quantity="1" data-product_id="<?php echo esc_attr($product->get_id()); ?>" class="inline-flex items-center gap-1.5 min-h-10 px-3 rounded-[4px] bg-inv-surface-1 text-xs font-semibold text-inv-ink whitespace-nowrap hover:bg-inv-blue hover:text-white transition-colors duration-[120ms] add_to_cart_button ajax_add_to_cart">
                <?php echo invit_icon('plus', 'w-4 h-4'); ?>
                В заявку
            </a>
        </div>
    </div>
</div>
