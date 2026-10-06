<?php
/**
 * Template Name: Документация
 *
 * Перенос src/pages/CertificatesPage.tsx и CertificateModal.tsx: сертификаты
 * одним списком (по клику — скан крупно, оригинал и скачивание), ниже
 * техническая библиотека. Все файлы лежат в теме, от старого сайта не зависят.
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[1400px] mx-auto px-4 lg:px-8';
$section_pad = 'py-10 sm:py-14 lg:py-20';
$certificates = invit_data('certificates');
$library = invit_data('library');
$docs = ['документ', 'документа', 'документов'];

/** «1,1 МБ», «87 КБ». */
$size = static function ($bytes) {
    return $bytes >= 1048576
        ? str_replace('.', ',', number_format($bytes / 1048576, 1, '.', '')) . ' МБ'
        : round($bytes / 1024) . ' КБ';
};
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Документация']]]); ?>

<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14 lg:py-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
            <h1 class="lg:col-span-7 text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.15]">Документы на продукцию EUROBAND</h1>
            <p class="lg:col-span-5 text-base leading-[1.55] text-inv-on-deep">
                Технические свидетельства, декларации о соответствии, сертификат продукции
                собственного производства и свидетельство технической компетентности.
                Паспорт качества прикладываем к каждой партии.
            </p>
        </div>
    </div>
</section>

<?php /* Сертификаты одним списком: делить их по типу клиент не просил */ ?>
<section class="bg-white">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div data-fade class="flex items-baseline justify-between gap-4 flex-wrap md:pr-24 xl:pr-28">
            <h2 class="text-2xl sm:text-3xl font-semibold text-inv-ink tracking-[-0.01em]">Сертификаты и декларации</h2>
            <span class="text-sm text-inv-ink-muted tabular-nums"><?php echo esc_html(count($certificates) . ' ' . invit_plural(count($certificates), $docs)); ?></span>
        </div>

        <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" data-fade-group>
            <?php foreach ($certificates as $cert) : ?>
                <button type="button" data-fade-item data-open-modal="cert-<?php echo esc_attr($cert['id']); ?>" class="group flex flex-col text-left rounded-[8px] border border-inv-border bg-white overflow-hidden cursor-zoom-in transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                    <span class="relative block bg-inv-surface-2">
                        <img src="<?php echo esc_url(invit_asset('img/certificates/' . $cert['id'] . '.webp')); ?>" alt="<?php echo esc_attr($cert['title']); ?>" loading="lazy" class="w-full h-[240px] object-contain p-3">
                        <span aria-hidden="true" class="absolute right-3 bottom-3 flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/90 text-inv-blue opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]">
                            <?php echo invit_icon('maximize-2', 'w-4 h-4'); ?>
                        </span>
                    </span>
                    <span class="flex-1 p-4 sm:p-5 border-t border-inv-border-subtle">
                        <span class="block text-sm font-semibold text-inv-ink leading-snug"><?php echo esc_html($cert['title']); ?></span>
                        <span class="mt-1.5 block text-sm text-inv-ink-muted"><?php echo esc_html(!empty($cert['validUntil']) ? 'действует до ' . $cert['validUntil'] : $cert['type']); ?></span>
                    </span>
                </button>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* Техническая библиотека: нормы, схемы монтажа и листовки на ленты */ ?>
<section class="bg-inv-surface-1">
    <div class="<?php echo $wrap . ' ' . $section_pad; ?>">
        <div data-fade class="flex items-baseline justify-between gap-4 flex-wrap md:pr-24 xl:pr-28">
            <h2 class="text-2xl sm:text-3xl font-semibold text-inv-ink tracking-[-0.01em]">Техническая документация</h2>
            <span class="text-sm text-inv-ink-muted tabular-nums"><?php echo esc_html(count($library) . ' ' . invit_plural(count($library), $docs)); ?></span>
        </div>

        <p class="mt-3 max-w-[680px] text-base leading-[1.55] text-inv-ink-muted">
            Нормы по монтажным швам и воздуховодам, схемы монтажа и технические листы
            на наши ленты. Файлы скачиваются с нашего сайта.
        </p>

        <div class="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" data-fade-group>
            <?php foreach ($library as $doc) : ?>
                <a data-fade-item href="<?php echo esc_url(invit_asset('docs/library/' . $doc['file'])); ?>" target="_blank" rel="noreferrer" class="group flex items-start gap-4 rounded-[8px] border border-inv-border bg-white p-4 sm:p-5 transition-[transform,box-shadow] duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-inv-surface-1 text-inv-blue">
                        <?php echo invit_icon('file-text', 'w-5 h-5'); ?>
                    </span>
                    <span class="flex-1">
                        <span class="block text-sm font-semibold text-inv-ink leading-snug group-hover:text-inv-blue transition-colors duration-[120ms]"><?php echo esc_html($doc['title']); ?></span>
                        <?php if (!empty($doc['text'])) : ?>
                            <span class="mt-1.5 block text-[13px] leading-[1.5] text-inv-ink-muted"><?php echo esc_html($doc['text']); ?></span>
                        <?php endif; ?>
                        <span class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-inv-blue">
                            <?php echo invit_icon('download', 'w-3.5 h-3.5'); ?>
                            Скачать · <?php echo esc_html(strtoupper(pathinfo($doc['file'], PATHINFO_EXTENSION)) . ', ' . $size($doc['size'])); ?>
                        </span>
                    </span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* Окна документов: скан крупно, оригинал и скачивание (CertificateModal.tsx) */ ?>
<?php foreach ($certificates as $cert) :
    $file = $cert['file'] ?? ($cert['id'] . '.jpg');
    $original = invit_asset('docs/certificates/' . $file);
    $download = mb_substr(trim(preg_replace('/[\\\\\/:*?"<>|]/', '', $cert['title'])), 0, 80) . '.' . pathinfo($cert['file'] ?? 'x.jpg', PATHINFO_EXTENSION);
    ?>
    <div data-modal="cert-<?php echo esc_attr($cert['id']); ?>" hidden class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
        <div class="relative bg-white rounded-xl max-w-xl w-full shadow-lg border border-line overflow-hidden" data-modal-card>
            <div class="bg-brand-blue text-white p-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <?php echo invit_icon('award', 'w-5 h-5 text-white'); ?>
                    <span class="font-semibold text-sm"><?php echo esc_html($cert['type']); ?></span>
                </div>
                <button type="button" data-modal-close class="p-1 rounded-[4px] hover:bg-white/20 text-white transition-colors cursor-pointer" aria-label="Закрыть">
                    <?php echo invit_icon('x', 'w-5 h-5'); ?>
                </button>
            </div>

            <div class="p-6 space-y-4">
                <div class="bg-white rounded-xl overflow-hidden border border-line h-[420px] flex items-center justify-center p-2">
                    <img src="<?php echo esc_url(invit_asset('img/certificates/' . $cert['id'] . '.webp')); ?>" alt="<?php echo esc_attr($cert['title']); ?>" loading="lazy" class="w-full h-full object-contain rounded">
                </div>

                <div>
                    <h3 class="text-base font-semibold text-ink leading-snug"><?php echo esc_html($cert['title']); ?></h3>
                    <?php if (!empty($cert['issuedBy']) || !empty($cert['validUntil'])) : ?>
                        <div class="mt-2 p-3 bg-surface-soft border border-line rounded-lg text-xs space-y-1 text-ink/70">
                            <?php if (!empty($cert['issuedBy'])) : ?>
                                <div class="flex justify-between"><span>Орган сертификации:</span><span class="font-bold text-ink"><?php echo esc_html($cert['issuedBy']); ?></span></div>
                            <?php endif; ?>
                            <?php if (!empty($cert['validUntil'])) : ?>
                                <div class="flex justify-between"><span>Срок действия:</span><span class="font-bold text-emerald-700">до <?php echo esc_html($cert['validUntil']); ?></span></div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <div class="pt-2 flex justify-between items-center gap-2">
                    <div class="flex items-center gap-4">
                        <a href="<?php echo esc_url($original); ?>" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors">
                            <?php echo invit_icon('external-link', 'w-3.5 h-3.5'); ?>
                            <span>Открыть оригинал</span>
                        </a>
                        <a href="<?php echo esc_url($original); ?>" download="<?php echo esc_attr($download); ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-hover transition-colors">
                            <?php echo invit_icon('download', 'w-3.5 h-3.5'); ?>
                            <span>Скачать</span>
                        </a>
                    </div>
                    <button type="button" data-modal-close class="px-4 py-2 bg-surface-soft hover:bg-surface-soft text-ink font-semibold text-sm rounded-[4px] cursor-pointer">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
<?php endforeach; ?>

<?php get_footer(); ?>
