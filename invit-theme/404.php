<?php
/**
 * Страница не найдена — перенос src/pages/NotFoundPage.tsx.
 */

if (!defined('ABSPATH')) exit;

get_header();
?>
<section class="max-w-[1340px] mx-auto px-5 py-24 text-center space-y-5">
    <span class="block text-6xl font-bold text-brand-blue">404</span>
    <h1 class="text-2xl font-bold text-ink tracking-tight">Страница не найдена</h1>
    <p class="text-sm text-ink/70 max-w-md mx-auto">
        Возможно, раздел переехал. Загляните в каталог продукции EUROBAND или напишите нам — подскажем,
        где искать нужную позицию.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-sm px-6 py-3 rounded-[4px] transition-colors">В каталог</a>
        <a href="<?php echo esc_url(home_url('/')); ?>" class="border border-line hover:bg-surface-soft text-ink font-bold text-sm px-6 py-3 rounded-[4px] transition-colors">На главную</a>
    </div>
</section>
<?php get_footer(); ?>
