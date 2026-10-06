<?php
/**
 * Обычная страница: заголовок на тёмной плашке и содержимое редактора.
 */

if (!defined('ABSPATH')) exit;

get_header();

/* Заявка на счёт — своя страница, как в React (CartPage.tsx) */
if (function_exists('is_cart') && is_cart()) {
    get_template_part('template-parts/cart-page');
    get_footer();
    return;
}

/*
 * Заявка и её оформление — обычные страницы с шорткодом Woo. Отдельного
 * woocommerce.php в теме нет намеренно: он перехватывал бы и каталог,
 * подменяя наш archive-product.php стандартной витриной.
 */
$is_shop_page = function_exists('is_cart') && (is_cart() || is_checkout() || is_account_page());
?>

<?php if ($is_shop_page) : ?>
    <div class="bg-inv-surface-1 border-b border-inv-border">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-3 text-sm text-inv-ink-muted [&_a]:text-inv-ink [&_a:hover]:text-inv-blue [&_a]:transition-colors">
            <?php woocommerce_breadcrumb(['delimiter' => ' <span class="px-1 text-inv-border">/</span> ']); ?>
        </div>
    </div>
<?php endif; ?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            <?php the_title(); ?>
        </h1>

        <?php if (function_exists('is_cart') && is_cart()) : ?>
            <p class="mt-3 text-base leading-[1.55] text-inv-on-deep max-w-[70ch]">
                Это лист заявки: по нему менеджер выставит счёт-фактуру. Оплата картой на
                сайте не предусмотрена.
            </p>
        <?php endif; ?>
    </div>
</section>

<section class="bg-white py-10 sm:py-14">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div class="<?php echo $is_shop_page ? '' : 'max-w-[70ch] '; ?>text-base leading-[1.6] text-inv-ink [&_p]:mt-4 [&_p:first-child]:mt-0 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_a:not([class])]:text-inv-blue [&_a:not([class]):hover]:underline">
            <?php
            while (have_posts()) : the_post();
                the_content();
            endwhile;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
