<?php
/**
 * Новости — перенос src/pages/NewsPage.tsx: обложка, дата, рубрика,
 * заголовок, анонс и «Читать полностью». Заметки — обычные записи WordPress.
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[1400px] mx-auto px-4 lg:px-8';
$news = get_posts(['post_type' => 'post', 'posts_per_page' => -1, 'post_status' => 'publish']);
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Новости']]]); ?>

<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
            <h1 class="lg:col-span-7 text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">Новости компании</h1>
            <p class="lg:col-span-5 text-base leading-[1.55] text-inv-on-deep">
                Подтверждение статуса производителя, переезды офиса и склада, изменения
                реквизитов и контактов.
            </p>
        </div>
    </div>
</section>

<section class="bg-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14 lg:py-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-fade-group>
            <?php foreach ($news as $article) : ?>
                <article data-fade-item class="h-full">
                    <a href="<?php echo esc_url(get_permalink($article)); ?>" class="group flex h-full flex-col overflow-hidden rounded-[8px] border border-inv-border bg-white transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                        <span class="block h-48 overflow-hidden bg-inv-surface-1">
                            <img src="<?php echo esc_url(invit_news_cover($article)); ?>" alt="" aria-hidden="true" loading="lazy" class="h-full w-full <?php echo esc_attr(invit_news_cover_fit($article)); ?> transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]">
                        </span>

                        <span class="flex flex-1 flex-col p-5">
                            <span class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-inv-ink-muted">
                                <span class="tabular-nums"><?php echo esc_html(get_the_date('j F Y', $article)); ?></span>
                                <span class="rounded-[4px] border border-inv-border px-2 py-0.5 text-xs font-semibold text-inv-ink"><?php echo esc_html(invit_news_category($article)); ?></span>
                            </span>

                            <span class="mt-3 block text-lg font-semibold leading-snug text-inv-ink group-hover:text-inv-blue transition-colors duration-[120ms]"><?php echo esc_html(get_the_title($article)); ?></span>
                            <span class="mt-2 block text-sm leading-relaxed text-inv-ink-muted"><?php echo esc_html(invit_news_excerpt($article)); ?></span>

                            <span class="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-inv-blue">
                                Читать полностью
                                <?php echo invit_icon('arrow-right', 'w-4 h-4 transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1'); ?>
                            </span>
                        </span>
                    </a>
                </article>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
