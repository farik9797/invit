<?php
/**
 * Template Name: Лучший продукт 2013
 *
 * Перенос src/pages/BestProductPage.tsx: страница о победе в конкурсе 2013 года,
 * на неё ведёт медаль у правого края. Факты — со страницы клиента invit.by/bestsel.
 */

if (!defined('ABSPATH')) exit;

get_header();

$wrap = 'max-w-[1100px] mx-auto px-5';
$diploma = invit_asset('img/awards/diplom-2013.webp');
$alt = 'Диплом конкурса «Лучший строительный продукт года — 2013»';
$entries = [
    ['EUROBAND ВЛ и ВЛ(а)', 'герметизирующие ленты внутреннего слоя шва'],
    ['EUROBAND НЛ', 'герметизирующая лента наружного слоя'],
    ['EUROBAND ПСУЛ', 'саморасширяющаяся уплотнительная лента'],
];
?>

<?php get_template_part('template-parts/breadcrumbs', null, ['items' => [['label' => 'Лучший строительный продукт года — 2013']]]); ?>

<section class="bg-inv-deep text-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14">
        <span class="inline-flex items-center gap-2 text-sm text-white/70">
            <?php echo invit_icon('award', 'w-4 h-4'); ?>
            Республиканский профессиональный конкурс
        </span>
        <h1 class="mt-4 text-2xl sm:text-3xl md:text-[40px] font-semibold tracking-[-0.01em] leading-[1.15]">Лучший строительный продукт года — 2013</h1>
        <p class="mt-4 max-w-[60ch] text-sm sm:text-base leading-[1.55] text-inv-on-deep">
            Монтажные ленты EUROBAND для установки светопрозрачных конструкций признаны
            лучшим продуктом года в категории «Клеевые и герметизирующие материалы».
        </p>
    </div>
</section>

<section class="bg-white">
    <div class="<?php echo $wrap; ?> py-10 sm:py-14">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div class="lg:col-span-5">
                <button type="button" data-zoom="<?php echo esc_url($diploma); ?>" data-zoom-alt="<?php echo esc_attr($alt); ?>" aria-label="Открыть диплом крупнее" class="group relative block w-full rounded-[8px] border border-inv-border bg-white p-3 cursor-pointer transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                    <img src="<?php echo esc_url($diploma); ?>" alt="<?php echo esc_attr($alt); ?>" class="w-full h-auto rounded-[4px]">
                    <span class="absolute right-5 bottom-5 flex items-center justify-center w-9 h-9 rounded-[4px] bg-white/90 text-inv-blue opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]">
                        <?php echo invit_icon('maximize-2', 'w-4 h-4'); ?>
                    </span>
                </button>
            </div>

            <div class="lg:col-span-7 space-y-8">
                <div class="space-y-3 text-sm sm:text-base leading-relaxed text-inv-ink-muted">
                    <p>
                        ООО «ИНВИТ» впервые участвовало в десятом, юбилейном Республиканском
                        профессиональном конкурсе «Лучший строительный продукт года — 2013» и подало
                        на рассмотрение конкурсной комиссии сразу четыре своих продукта.
                    </p>
                    <p>
                        Победу принесли монтажные ленты для установки светопрозрачных конструкций —
                        в категории «Клеевые и герметизирующие материалы».
                    </p>
                    <p>
                        Итоги объявили на строительной выставке «Будпрагрэс-2013» — крупнейшей
                        ежегодной специализированной выставке республики.
                    </p>
                </div>

                <div>
                    <h2 class="text-lg font-semibold text-inv-ink">Что подавали на конкурс</h2>
                    <ul class="mt-3 divide-y divide-inv-border border border-inv-border rounded-[8px] overflow-hidden">
                        <?php foreach ($entries as [$name, $note]) : ?>
                            <li class="px-4 py-3">
                                <span class="block text-sm font-semibold text-inv-ink"><?php echo esc_html($name); ?></span>
                                <span class="block mt-0.5 text-sm text-inv-ink-muted"><?php echo esc_html($note); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>

                <div class="rounded-[8px] border border-inv-border bg-inv-surface-1 p-5">
                    <h2 class="text-base font-semibold text-inv-ink">Зачем нужны герметизирующие ленты</h2>
                    <p class="mt-2 text-sm leading-relaxed text-inv-ink-muted">
                        Они герметизируют и уплотняют монтажный шов при установке окон по современным
                        нормам. Внутренняя пароизоляционная и наружная паропроницаемая ленты — часть
                        системы тёплого монтажа светопрозрачных конструкций, того самого «монтажа по
                        ГОСТу».
                    </p>
                </div>

                <div class="flex flex-wrap gap-3">
                    <a href="<?php echo esc_url(invit_url_category('materialy-dlya-okon', ['sub' => 'montazhnye-lenty-dlya-okon'])); ?>" class="inline-flex items-center gap-2 min-h-11 px-6 rounded-[4px] bg-inv-blue hover:bg-inv-blue-hover text-white text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                        Монтажные ленты в каталоге
                        <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                    </a>
                    <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="inline-flex items-center min-h-11 px-6 rounded-[4px] border border-inv-border text-inv-ink text-sm font-semibold hover:border-inv-blue hover:text-inv-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue">
                        Документы на продукцию
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_template_part('template-parts/lightbox'); ?>

<?php get_footer(); ?>
