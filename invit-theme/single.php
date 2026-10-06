<?php
/**
 * Заметка — перенос src/pages/NewsArticlePage.tsx: рубрика и дата, заголовок,
 * обложка по теме, текст и две соседние заметки.
 */

if (!defined('ABSPATH')) exit;

get_header();

while (have_posts()) : the_post();
    $article = get_post();
    $paragraphs = array_filter(array_map(
        static fn($p) => trim(html_entity_decode(wp_strip_all_tags($p), ENT_QUOTES, 'UTF-8')),
        preg_split('/<\/p>\s*/', $article->post_content)
    ));
    $others = get_posts(['post_type' => 'post', 'posts_per_page' => 2, 'post__not_in' => [$article->ID], 'post_status' => 'publish']);
    ?>

    <?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Новости', 'url' => home_url('/news/')], ['label' => get_the_title()]]]); ?>

    <article class="max-w-[900px] mx-auto px-5 py-8 space-y-6">
        <div class="space-y-3">
            <div class="flex items-center gap-3 flex-wrap">
                <span class="rounded-[4px] border border-line bg-surface-soft px-2.5 py-1 text-xs font-semibold text-ink"><?php echo esc_html(invit_news_category($article)); ?></span>
                <span class="flex items-center gap-1.5 text-sm text-ink/55 tabular-nums">
                    <?php echo invit_icon('calendar', 'w-4 h-4'); ?>
                    <?php echo esc_html(get_the_date('j F Y')); ?>
                </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-snug"><?php the_title(); ?></h1>
        </div>

        <img src="<?php echo esc_url(invit_news_cover($article)); ?>" alt="" loading="lazy" class="w-full h-56 sm:h-72 <?php echo esc_attr(invit_news_cover_fit($article)); ?> rounded-xl border border-line bg-white">

        <div class="text-sm text-ink/80 leading-relaxed space-y-4">
            <?php foreach ($paragraphs as $paragraph) : ?>
                <p><?php echo esc_html($paragraph); ?></p>
            <?php endforeach; ?>
        </div>

        <a href="<?php echo esc_url(home_url('/news/')); ?>" class="inline-flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors pt-2">
            <?php echo invit_icon('arrow-left', 'w-4 h-4'); ?>
            <span>Все новости</span>
        </a>
    </article>

    <?php if ($others) : ?>
        <section class="py-12 bg-white border-t border-line">
            <div class="max-w-[900px] mx-auto px-5 space-y-5">
                <h2 class="text-lg font-bold text-ink tracking-tight">Другие новости</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <?php foreach ($others as $other) : ?>
                        <a href="<?php echo esc_url(get_permalink($other)); ?>" class="flex gap-3 p-3 rounded-xl border border-line hover:border-brand-sky hover:shadow-xs transition-all group">
                            <img src="<?php echo esc_url(invit_news_cover($other)); ?>" alt="<?php echo esc_attr(get_the_title($other)); ?>" class="w-20 h-20 <?php echo esc_attr(invit_news_cover_fit($other)); ?> bg-white border border-line rounded-xl shrink-0">
                            <div class="min-w-0 space-y-1">
                                <span class="text-[11px] text-ink/45 font-semibold"><?php echo esc_html(get_the_date('j F Y', $other)); ?></span>
                                <span class="block text-xs font-semibold text-ink group-hover:text-brand-blue transition-colors line-clamp-3 leading-snug"><?php echo esc_html(get_the_title($other)); ?></span>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
    <?php endif; ?>
<?php endwhile; ?>

<?php get_footer(); ?>
