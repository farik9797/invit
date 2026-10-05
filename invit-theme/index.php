<?php
/**
 * Запасной шаблон: новости и любые записи, для которых нет своего файла.
 */

if (!defined('ABSPATH')) exit;

get_header();
?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1340px] mx-auto px-5 py-8 sm:py-10 lg:py-12">
        <h1 class="text-3xl sm:text-4xl lg:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">
            <?php
            if (is_home() && !is_front_page()) {
                echo esc_html(get_the_title(get_option('page_for_posts')) ?: 'Новости компании');
            } elseif (is_search()) {
                printf('Поиск: %s', esc_html(get_search_query()));
            } else {
                the_archive_title();
            }
            ?>
        </h1>
    </div>
</section>

<section class="bg-white py-10 sm:py-14">
    <div class="max-w-[1340px] mx-auto px-5">
        <?php if (have_posts()) : ?>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php while (have_posts()) : the_post(); ?>
                    <li class="group flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>" class="block h-[180px] overflow-hidden bg-inv-surface-1">
                                <?php the_post_thumbnail('medium_large', ['class' => 'w-full h-full object-cover', 'loading' => 'lazy']); ?>
                            </a>
                        <?php endif; ?>

                        <div class="flex-1 flex flex-col p-5">
                            <time datetime="<?php echo esc_attr(get_the_date('c')); ?>" class="text-xs text-inv-ink-muted">
                                <?php echo esc_html(get_the_date('j F Y')); ?>
                            </time>

                            <a href="<?php the_permalink(); ?>" class="mt-2 text-base font-semibold leading-snug text-inv-ink group-hover:text-inv-blue transition-colors duration-[120ms]">
                                <?php the_title(); ?>
                            </a>

                            <p class="mt-2 text-sm leading-relaxed text-inv-ink-muted">
                                <?php echo esc_html(wp_trim_words(get_the_excerpt(), 22)); ?>
                            </p>

                            <a href="<?php the_permalink(); ?>" class="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                                Читать
                                <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                            </a>
                        </div>
                    </li>
                <?php endwhile; ?>
            </ul>

            <div class="mt-8">
                <?php the_posts_pagination([
                    'mid_size' => 1,
                    'prev_text' => 'Назад',
                    'next_text' => 'Вперёд',
                ]); ?>
            </div>
        <?php else : ?>
            <p class="text-base text-inv-ink-muted">Ничего не нашлось. Загляните в каталог продукции или напишите нам — подскажем, где искать нужную позицию.</p>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
