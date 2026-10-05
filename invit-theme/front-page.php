<?php
/**
 * Главная: слайдер первого экрана, полоса преимуществ, разделы каталога и
 * ленты собственного производства. Тексты по умолчанию — те же, что стоят на
 * нынешнем сайте, поэтому страница готова ещё до заполнения полей ACF.
 */

if (!defined('ABSPATH')) exit;

get_header();

$img = get_template_directory_uri() . '/assets/img';

$slides_default = [
    [
        'lead' => 'Уплотнительные и герметизирующие',
        'accent' => 'ленты',
        'text' => 'Прямые поставки от производителя для оконных, кровельных и фасадных работ по всей РБ. Работаем с 2001 года. Гарантируем оптовые цены, объёмы и документы для технадзора. Изготовим ленты нетипичных размеров под ваш проект.',
        'image' => $img . '/hero/euroband-boxes-range.webp',
        'cta' => 'Смотреть каталог',
        'url' => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/'),
    ],
    [
        'lead' => 'Самоклеящаяся тепло-звукоизоляционная',
        'accent' => 'лента ПЭС',
        'text' => 'Высокая адгезия, плотное соединение стыкуемых поверхностей: сэндвич-панели, перегородки из гипсокартона, фланцевые соединения воздуховодов, производство оборудования. Много размеров всегда на складе, остальное изготовим под вашу задачу.',
        'image' => $img . '/hero/pes-grey-rolls.webp',
        'cta' => 'Ленты ПЭС',
        'url' => home_url('/product-category/uplotnitelnye-lenty-pes-samokleyaschiesy/'),
    ],
    [
        'lead' => 'Защита стыков оконных проёмов —',
        'accent' => 'ленты EUROBAND ВЛ(а) и НЛ',
        'text' => 'Внутренняя пароизоляция примыкания окно/стена, наружная защита монтажного шва от ветра и дождя. Всегда в наличии на складе. Нетипичные размеры в любом сочетании клейких полос делаем под заказ.',
        'image' => $img . '/hero/alu-butyl-foil.webp',
        'cta' => 'Ленты для окон',
        'url' => home_url('/product-category/materialy-dlya-okon/'),
    ],
    [
        'lead' => 'Герметизация соединений —',
        'accent' => 'бутилкаучуковые ленты EUROBAND ЛБ и ЛБА',
        'text' => 'Надёжная гидроизоляция швов и стыков листовых материалов: перехлёсты профнастила, монтажные швы сэндвич-панелей, зенитные фонари и фасадные системы. Защита от ветра и воды, товар всегда в наличии.',
        'image' => $img . '/hero/butyl-window-tapes.webp',
        'cta' => 'Бутиловые ленты',
        'url' => home_url('/product-category/materialy-dlya-okon/'),
    ],
    [
        'lead' => 'Паропроницаемая лента',
        'accent' => 'ПСУЛ EUROBAND',
        'text' => 'Уплотняет зазоры, защищает швы и стыки: оконные проёмы, двери, кровля, вентиляция, фасады и деревянное домостроение. Быстрый монтаж благодаря клейкой полосе. Всегда в наличии, доставка по всей Беларуси.',
        'image' => $img . '/hero/psul-euroband.webp',
        'cta' => 'Лента ПСУЛ',
        'url' => home_url('/product-category/materialy-dlya-okon/'),
    ],
];

$slides = invit_field('slides', $slides_default);

$benefits_default = [
    ['image' => $img . '/benefits/proizvodstvo.webp', 'title' => 'Собственное производство'],
    ['image' => $img . '/benefits/dostavka.webp', 'title' => 'Быстрая доставка'],
    ['image' => $img . '/benefits/sertifikat.webp', 'title' => 'Сертифицированный товар'],
    ['image' => $img . '/benefits/ceny.webp', 'title' => 'Честные цены'],
    ['image' => $img . '/benefits/zakaz.webp', 'title' => 'Заказ через сайт 24/7'],
];

$benefits = invit_field('benefits', $benefits_default);
$sections = invit_catalog_sections();
?>

<?php /* Первый экран: кадры лежат одной стопкой, видимый проявляется поверх. */ ?>
<section data-hero class="relative flex items-center bg-inv-deep overflow-hidden min-h-[85vh]">
    <?php foreach ($slides as $i => $slide) : ?>
        <div
            data-hero-image
            class="absolute inset-0 transition-opacity duration-700 ease-out"
            style="opacity: <?php echo $i === 0 ? '1' : '0'; ?>"
            aria-hidden="<?php echo $i === 0 ? 'false' : 'true'; ?>"
        >
            <img src="<?php echo esc_url($slide['image']); ?>" alt="" class="absolute inset-0 w-full h-full object-cover" <?php echo $i === 0 ? '' : 'loading="lazy"'; ?>>
            <div class="absolute inset-0 bg-gradient-to-r from-inv-deep via-inv-deep/85 to-inv-deep/30"></div>
        </div>
    <?php endforeach; ?>

    <div class="relative w-full max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-16">
        <div class="grid max-w-3xl">
            <?php foreach ($slides as $i => $slide) : ?>
                <div
                    data-hero-text
                    class="col-start-1 row-start-1 transition-opacity duration-700 ease-out"
                    style="opacity: <?php echo $i === 0 ? '1' : '0'; ?>"
                >
                    <img src="<?php echo esc_url($img . '/euroband-color.svg'); ?>" alt="EUROBAND" class="h-10 sm:h-12 w-auto mb-6 bg-white rounded-[4px] px-4 py-2" width="260" height="48">

                    <h1 class="text-[32px] sm:text-[44px] lg:text-[52px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                        <?php echo esc_html($slide['lead']); ?>
                        <span class="border-b-4 border-inv-red pb-1"><?php echo esc_html($slide['accent']); ?></span>
                    </h1>

                    <p class="mt-6 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[60ch]">
                        <?php echo esc_html($slide['text']); ?>
                    </p>

                    <div class="mt-8 flex flex-col sm:flex-row gap-3">
                        <a href="<?php echo esc_url($slide['url']); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-white text-inv-deep text-sm font-semibold hover:bg-inv-surface-1 transition-colors duration-[120ms]">
                            <?php echo esc_html($slide['cta']); ?>
                        </a>
                        <button type="button" data-request class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-[120ms] cursor-pointer">
                            Запросить расчёт
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <?php if (count($slides) > 1) : ?>
            <div class="mt-10 flex items-center gap-2">
                <?php foreach ($slides as $i => $slide) : ?>
                    <button type="button" data-hero-dot aria-label="Слайд <?php echo (int) ($i + 1); ?>" aria-current="<?php echo $i === 0 ? 'true' : 'false'; ?>" class="w-8 h-1 rounded-full <?php echo $i === 0 ? 'bg-white' : 'bg-white/40'; ?> transition-colors duration-[240ms] cursor-pointer"></button>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>

<?php /* Разделы каталога: четыре в ряд на большом экране, два на телефоне. */ ?>
<section class="bg-white py-14 sm:py-20">
    <div class="max-w-[1340px] mx-auto px-5">
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-inv-ink">
            <?php echo esc_html(invit_field('categories_title', 'Категории продукции')); ?>
        </h2>
        <p class="mt-3 text-base leading-[1.55] text-inv-ink-muted max-w-[70ch]">
            <?php echo esc_html(invit_field('categories_text', 'Ленты EUROBAND собственного производства и сопутствующие материалы прямой поставки.')); ?>
        </p>

        <div class="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach ($sections as $section) :
                $thumb_id = get_term_meta($section->term_id, 'thumbnail_id', true);
                $thumb = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'medium') : '';
                ?>
                <a href="<?php echo esc_url(get_term_link($section)); ?>" class="group flex flex-col rounded-[8px] border border-inv-border bg-white overflow-hidden transition-[transform,box-shadow] duration-[240ms] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(22,44,88,0.16)]">
                    <span class="flex items-center justify-center h-[120px] sm:h-[150px] bg-inv-surface-1 overflow-hidden">
                        <?php if ($thumb) : ?>
                            <img src="<?php echo esc_url($thumb); ?>" alt="" loading="lazy" class="w-full h-full object-contain p-3">
                        <?php else : ?>
                            <span class="text-inv-blue"><?php echo invit_icon('layers', 'w-10 h-10'); ?></span>
                        <?php endif; ?>
                    </span>
                    <span class="flex-1 px-4 py-3">
                        <span class="block text-sm font-semibold leading-snug text-inv-ink group-hover:text-inv-blue transition-colors duration-[120ms]">
                            <?php echo esc_html($section->name); ?>
                        </span>
                        <span class="mt-1 block text-xs text-inv-ink-muted"><?php echo esc_html($section->count); ?> позиций</span>
                    </span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* Полоса преимуществ: пять причин заказать у ИНВИТ, коротко и в ряд. */ ?>
<section class="bg-inv-surface-1 pt-10 sm:pt-14 pb-14 sm:pb-20">
    <div class="max-w-[1340px] mx-auto px-5">
        <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 rounded-[12px] border border-inv-border bg-white px-5 py-8 sm:px-8 sm:py-10">
            <?php foreach ($benefits as $benefit) : ?>
                <li class="flex flex-col items-center gap-3.5 text-center last:col-span-2 sm:last:col-span-1">
                    <?php if (!empty($benefit['image'])) : ?>
                        <img src="<?php echo esc_url($benefit['image']); ?>" alt="" aria-hidden="true" width="56" height="56" class="w-12 h-12 sm:w-14 sm:h-14 select-none">
                    <?php endif; ?>
                    <span class="text-xs sm:text-[13px] font-semibold leading-snug text-inv-ink max-w-[16ch]">
                        <?php echo esc_html($benefit['title']); ?>
                    </span>
                    <?php if (!empty($benefit['text'])) : ?>
                        <span class="text-xs leading-snug text-inv-ink-muted max-w-[22ch]"><?php echo esc_html($benefit['text']); ?></span>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>

<?php /* Ленты собственного производства: отбираем по метке, которой помечены
         карточки EUROBAND при импорте каталога. */ ?>
<?php
$own = new WP_Query([
    'post_type' => 'product',
    'posts_per_page' => 8,
    'tax_query' => [[
        'taxonomy' => 'product_tag',
        'field' => 'name',
        'terms' => 'Собственное производство',
    ]],
    'no_found_rows' => true,
]);
?>
<?php if ($own->have_posts()) : ?>
    <section class="bg-white py-14 sm:py-20">
        <div class="max-w-[1340px] mx-auto px-5">
            <div class="flex items-end justify-between gap-6">
                <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-inv-ink">Ленты EUROBAND</h2>
                <a href="<?php echo esc_url(add_query_arg('product_tag', 'sobstvennoe-proizvodstvo', function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/'))); ?>" class="inline-flex items-center gap-2 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors duration-[120ms] whitespace-nowrap">
                    Весь каталог
                    <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                </a>
            </div>

            <ul class="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <?php while ($own->have_posts()) : $own->the_post(); ?>
                    <li><?php wc_get_template_part('content', 'product-card'); ?></li>
                <?php endwhile; ?>
            </ul>
        </div>
    </section>
<?php endif; wp_reset_postdata(); ?>

<?php get_footer(); ?>
