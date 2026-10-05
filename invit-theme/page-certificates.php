<?php
/**
 * Template Name: Документация
 *
 * Сертификаты и технические свидетельства: что показать технадзору.
 */

if (!defined('ABSPATH')) exit;

get_header();

$lead = invit_field('lead', 'Сертификаты соответствия, технические свидетельства и паспорта на ленты EUROBAND. Скан любого документа пришлём по запросу.');
$documents = invit_field('documents', []);
?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1340px] mx-auto px-5 py-10 sm:py-14">
        <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] max-w-3xl">
            <?php the_title(); ?>
        </h1>
        <p class="mt-4 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[65ch]">
            <?php echo esc_html($lead); ?>
        </p>
    </div>
</section>

<section class="bg-white py-12 sm:py-16">
    <div class="max-w-[1340px] mx-auto px-5">
        <?php if ($documents) : ?>
            <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <?php foreach ($documents as $doc) : ?>
                    <li class="group flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
                        <?php if (!empty($doc['scan'])) : ?>
                            <span class="flex items-center justify-center h-[220px] bg-inv-surface-1 p-4 overflow-hidden">
                                <img src="<?php echo esc_url($doc['scan']); ?>" alt="" loading="lazy" class="max-h-full w-auto object-contain">
                            </span>
                        <?php endif; ?>

                        <div class="flex-1 flex flex-col p-5">
                            <h2 class="text-sm font-semibold leading-snug text-inv-ink"><?php echo esc_html($doc['title']); ?></h2>

                            <?php if (!empty($doc['period'])) : ?>
                                <span class="mt-1 text-xs text-inv-ink-muted">Действует: <?php echo esc_html($doc['period']); ?></span>
                            <?php endif; ?>

                            <?php if (!empty($doc['text'])) : ?>
                                <p class="mt-2 text-sm leading-relaxed text-inv-ink-muted"><?php echo esc_html($doc['text']); ?></p>
                            <?php endif; ?>

                            <?php if (!empty($doc['file'])) : ?>
                                <a href="<?php echo esc_url($doc['file']); ?>" target="_blank" rel="noopener" class="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms]">
                                    <?php echo invit_icon('file-text', 'w-4 h-4'); ?>
                                    Открыть документ
                                </a>
                            <?php endif; ?>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else : ?>
            <div class="rounded-[8px] border border-inv-border bg-inv-surface-1 px-5 py-8">
                <p class="text-base text-inv-ink">Документы пока не загружены.</p>
                <p class="mt-2 text-sm text-inv-ink-muted">
                    Добавьте их в поле «Документы» на этой странице — или запросите нужный
                    сертификат у менеджера, пришлём в тот же день.
                </p>
                <button type="button" data-request class="mt-5 inline-flex items-center justify-center min-h-11 px-5 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors duration-[120ms] cursor-pointer">
                    Запросить документ
                </button>
            </div>
        <?php endif; ?>

        <?php if (get_the_content()) : ?>
            <div class="mt-10 max-w-[70ch] text-base leading-[1.6] text-inv-ink-muted [&_p]:mt-4 [&_p:first-child]:mt-0">
                <?php while (have_posts()) : the_post(); the_content(); endwhile; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
