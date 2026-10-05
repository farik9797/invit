<?php
/**
 * Обычная страница: заголовок на тёмной плашке и содержимое редактора.
 */

if (!defined('ABSPATH')) exit;

get_header();
?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            <?php the_title(); ?>
        </h1>
    </div>
</section>

<section class="bg-white py-10 sm:py-14">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div class="max-w-[70ch] text-base leading-[1.6] text-inv-ink [&_p]:mt-4 [&_p:first-child]:mt-0 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_a:not([class])]:text-inv-blue [&_a:not([class]):hover]:underline">
            <?php
            while (have_posts()) : the_post();
                the_content();
            endwhile;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
