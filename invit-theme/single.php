<?php
/**
 * Новость целиком: обложка, дата, текст и возврат к списку.
 */

if (!defined('ABSPATH')) exit;

get_header();

while (have_posts()) : the_post();
    ?>
    <section class="bg-inv-deep text-white">
        <div class="max-w-[860px] mx-auto px-5 py-10 sm:py-14">
            <a href="<?php echo esc_url(get_permalink(get_option('page_for_posts')) ?: home_url('/news/')); ?>" class="inline-flex items-center gap-2 min-h-11 text-sm text-inv-on-deep hover:text-white transition-colors duration-[120ms]">
                <?php echo invit_icon('arrow-right', 'w-4 h-4 rotate-180'); ?>
                Все новости
            </a>

            <h1 class="mt-4 text-3xl sm:text-4xl font-semibold tracking-[-0.01em] leading-[1.15]">
                <?php the_title(); ?>
            </h1>

            <time datetime="<?php echo esc_attr(get_the_date('c')); ?>" class="mt-4 block text-sm text-inv-on-deep">
                <?php echo esc_html(get_the_date('j F Y')); ?>
            </time>
        </div>
    </section>

    <article class="bg-white py-10 sm:py-14">
        <div class="max-w-[860px] mx-auto px-5">
            <?php if (has_post_thumbnail()) : ?>
                <div class="mb-8 rounded-[8px] border border-inv-border bg-inv-surface-1 overflow-hidden">
                    <?php the_post_thumbnail('large', ['class' => 'w-full h-auto object-contain']); ?>
                </div>
            <?php endif; ?>

            <div class="text-base leading-[1.65] text-inv-ink [&_p]:mt-4 [&_p:first-child]:mt-0 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_a:not([class])]:text-inv-blue [&_a:not([class]):hover]:underline [&_img]:rounded-[8px]">
                <?php the_content(); ?>
            </div>

            <div class="mt-10 pt-6 border-t border-inv-border flex flex-col sm:flex-row gap-3">
                <a href="<?php echo esc_url(function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/')); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms]">
                    Смотреть каталог
                </a>
                <button type="button" data-request class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors duration-[120ms] cursor-pointer">
                    Запросить расчёт
                </button>
            </div>
        </div>
    </article>
<?php endwhile; ?>

<?php get_footer(); ?>
