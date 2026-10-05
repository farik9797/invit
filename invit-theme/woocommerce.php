<?php
/**
 * Обёртка для страниц WooCommerce, у которых нет своего шаблона: заявка,
 * оформление, «спасибо». Заголовок и крошки — как на остальных страницах.
 */

if (!defined('ABSPATH')) exit;

get_header();
?>

<div class="bg-inv-surface-1 border-b border-inv-border">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 text-sm text-inv-ink-muted [&_a]:text-inv-ink [&_a:hover]:text-inv-blue [&_a]:transition-colors">
        <?php woocommerce_breadcrumb(['delimiter' => ' <span class="px-1 text-inv-border">/</span> ']); ?>
    </div>
</div>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 sm:py-10">
        <h1 class="text-3xl sm:text-4xl font-semibold tracking-[-0.01em] leading-[1.15]">
            <?php woocommerce_page_title(); ?>
        </h1>
        <?php if (is_cart()) : ?>
            <p class="mt-3 text-base leading-[1.55] text-inv-on-deep max-w-[70ch]">
                Это лист заявки: по нему менеджер выставит счёт-фактуру. Оплата картой на
                сайте не предусмотрена.
            </p>
        <?php endif; ?>
    </div>
</section>

<section class="bg-white py-8 sm:py-12">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
        <?php woocommerce_content(); ?>
    </div>
</section>

<?php get_footer(); ?>
