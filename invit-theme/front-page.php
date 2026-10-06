<?php
/**
 * Главная — перенос src/pages/HomePage.tsx: слайдер, категории, полоса
 * преимуществ, ленты собственного производства, о компании, «с 2001 года»,
 * новости, форма расчёта на фото, полоса документов.
 */

if (!defined('ABSPATH')) exit;

get_header();

$img = static fn($path) => invit_asset('img/' . $path);

/* ---- Слайдер (src/components/home/Hero.tsx) ---- */
$slides = [
    [
        'lead' => 'Уплотнительные и герметизирующие',
        'accent' => 'ленты',
        'text' => 'Прямые поставки от производителя для оконных, кровельных и фасадных работ по всей РБ. Работаем с 2001 года. Гарантируем оптовые цены, объёмы и документы для технадзора. Изготовим ленты нетипичных размеров под ваш проект.',
        'image' => 'hero/euroband-boxes-range.webp',
        'href' => invit_url_catalog(),
        'cta' => 'Смотреть каталог',
    ],
    [
        'lead' => 'Самоклеящаяся тепло-звукоизоляционная',
        'accent' => 'лента ПЭС',
        'text' => 'Высокая адгезия, плотное соединение стыкуемых поверхностей: сэндвич-панели, перегородки из гипсокартона, фланцевые соединения воздуховодов, производство оборудования. Много размеров всегда на складе, остальное изготовим под вашу задачу.',
        'image' => 'hero/pes-grey-rolls.webp',
        'href' => invit_url_category('uplotnitelnye-lenty-pes-samokleyaschiesy'),
        'cta' => 'Ленты ПЭС',
    ],
    [
        'lead' => 'Защита стыков оконных проёмов —',
        'accent' => 'ленты EUROBAND ВЛ(а) и НЛ',
        'text' => 'Внутренняя пароизоляция примыкания окно/стена, наружная защита монтажного шва от ветра и дождя. Всегда в наличии на складе. Нетипичные размеры в любом сочетании клейких полос делаем под заказ.',
        'image' => 'hero/alu-butyl-foil.webp',
        'href' => invit_url_category('materialy-dlya-okon', ['sub' => 'montazhnye-lenty-dlya-okon']),
        'cta' => 'Ленты для окон',
    ],
    [
        'lead' => 'Герметизация соединений —',
        'accent' => 'бутилкаучуковые ленты EUROBAND ЛБ и ЛБА',
        'text' => 'Надёжная гидроизоляция швов и стыков листовых материалов: перехлёсты профнастила, монтажные швы сэндвич-панелей, зенитные фонари и фасадные системы. Защита от ветра и воды, товар всегда в наличии.',
        'image' => 'hero/butyl-window-tapes.webp',
        'href' => invit_url_category('materialy-dlya-okon', ['sub' => 'polnobutilovye-lenty']),
        'cta' => 'Бутиловые ленты',
    ],
    [
        'lead' => 'Паропроницаемая лента',
        'accent' => 'ПСУЛ EUROBAND',
        'text' => 'Уплотняет зазоры, защищает швы и стыки: оконные проёмы, двери, кровля, вентиляция, фасады и деревянное домостроение. Быстрый монтаж благодаря клейкой полосе. Всегда в наличии, доставка по всей Беларуси.',
        'image' => 'hero/psul-euroband.webp',
        'href' => invit_url_category('materialy-dlya-okon', ['sub' => 'samorasshiryayuschayasya-lenta-psul']),
        'cta' => 'Лента ПСУЛ',
    ],
];

/* ---- Данные блоков ниже ---- */
$counts = invit_catalog_counts();

$benefits = [
    ['icon' => 'benefits/proizvodstvo.webp', 'label' => 'Собственное производство'],
    ['icon' => 'benefits/dostavka.webp', 'label' => 'Быстрая доставка'],
    ['icon' => 'benefits/sertifikat.webp', 'label' => 'Сертифицированный товар'],
    ['icon' => 'benefits/ceny.webp', 'label' => 'Честные цены'],
    ['icon' => 'benefits/zakaz.webp', 'label' => 'Заказ через сайт 24/7'],
];

/* На главной — только ленты собственного производства, первые восемь */
$own_tapes = array_slice(array_values(array_filter(
    invit_catalog_items(),
    static fn($i) => $i[INVIT_I_OWN] && in_array($i[INVIT_I_SUB], invit_data('tapeSubcategories'), true)
)), 0, 8);

$facts = [
    ['value' => (int) wp_date('Y') - 2001, 'label' => 'лет на рынке'],
    ['value' => count(array_filter(invit_catalog_items(), static fn($i) => $i[INVIT_I_OWN])), 'label' => 'лент своего производства'],
    ['value' => count(invit_data('certificates')), 'label' => 'документов на продукцию'],
];

$values = [
    'качество продукции и стабильность характеристик от партии к партии;',
    'гибкость в ценообразовании и индивидуальный подход;',
    'клиенты, с которыми нам выгодно работать вдолгую.',
];

$news = get_posts(['post_type' => 'post', 'posts_per_page' => 3, 'post_status' => 'publish']);
$certificates = array_slice(invit_data('certificates'), 0, 5);
$arrow = static fn($extra = '') => invit_icon('arrow-right', trim('w-4 h-4 ' . $extra));
?>

<section data-hero class="relative flex items-center bg-brand-navy overflow-hidden min-h-[85vh]">
    <?php foreach ($slides as $idx => $slide) : ?>
        <img
            data-hero-image
            <?php echo $idx < 2 ? 'src="' . esc_url($img($slide['image'])) . '"' : ''; ?>
            data-src="<?php echo esc_url($img($slide['image'])); ?>"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 w-full h-full transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] object-cover <?php echo $idx === 0 ? 'opacity-90' : 'opacity-0'; ?>"
        >
    <?php endforeach; ?>
    <?php /* Затемняем только левую половину под текстом, правая — чистое фото */ ?>
    <div class="absolute inset-0 bg-gradient-to-r from-ink/85 from-10% via-ink/45 via-45% to-transparent to-70%"></div>
    <?php /* На телефоне текст поверх всей ширины — добавляем вертикальную подложку */ ?>
    <div class="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 via-40% to-ink/25 lg:hidden"></div>

    <div class="relative w-full max-w-[1340px] mx-auto px-5 py-20 sm:py-28 lg:py-16">
        <span class="inline-flex items-center rounded-[4px] bg-white px-4 py-2.5 mb-6 lg:mb-8">
            <img src="<?php echo esc_url($img('logo/euroband-color.svg')); ?>" alt="EUROBAND" class="h-6 sm:h-7 lg:h-8 w-auto">
        </span>

        <?php /* Слайды лежат в одной ячейке грида: высота равна самому длинному */ ?>
        <div class="grid max-w-3xl">
            <?php foreach ($slides as $idx => $slide) : $on = $idx === 0; ?>
                <div data-hero-text <?php echo $on ? 'data-active' : ''; ?> aria-hidden="<?php echo $on ? 'false' : 'true'; ?>" class="col-start-1 row-start-1 <?php echo $on ? '' : 'pointer-events-none'; ?>">
                    <h<?php echo $on ? '1' : '2'; ?> data-line style="--step: 0" class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.25] tracking-tight">
                        <?php echo esc_html($slide['lead']); ?>
                        <span class="border-b-4 border-white pb-1"><?php echo esc_html($slide['accent']); ?></span>
                    </h<?php echo $on ? '1' : '2'; ?>>

                    <p data-line style="--step: 1" class="mt-7 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
                        <?php echo esc_html($slide['text']); ?>
                    </p>

                    <div data-line style="--step: 2" class="mt-9 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
                        <a href="<?php echo esc_url($slide['href']); ?>" tabindex="<?php echo $on ? '0' : '-1'; ?>" class="inline-flex justify-center items-center bg-white hover:bg-brand-green-soft text-brand-navy text-sm font-semibold rounded-[4px] px-8 py-4 w-full sm:w-auto transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]">
                            <?php echo esc_html($slide['cta']); ?>
                        </a>
                        <button type="button" data-callback="Запрос расчёта с главной" tabindex="<?php echo $on ? '0' : '-1'; ?>" class="shine inline-flex justify-center items-center border border-white/25 hover:bg-white/10 text-white text-sm font-semibold rounded-[4px] px-8 py-4 w-full sm:w-auto cursor-pointer transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]">
                            Запросить расчёт
                        </button>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

        <?php /* Переключатели. На большом экране левый угол занимает стрелка «вниз» */ ?>
        <div class="mt-14 flex items-center gap-4 lg:pl-[104px]">
            <div class="flex items-center gap-2">
                <?php foreach ($slides as $idx => $slide) : ?>
                    <button type="button" data-hero-dot aria-label="Слайд <?php echo $idx + 1; ?>" aria-current="<?php echo $idx === 0 ? 'true' : 'false'; ?>" class="h-11 flex items-center cursor-pointer">
                        <span class="block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] <?php echo $idx === 0 ? 'w-10 bg-white' : 'w-4 bg-white/25 hover:bg-white/50'; ?>"></span>
                    </button>
                <?php endforeach; ?>
            </div>

            <span data-hero-counter class="text-xs text-white/40 tabular-nums">01 / <?php echo sprintf('%02d', count($slides)); ?></span>

            <?php /* Полоса прогресса до следующего слайда */ ?>
            <div class="hidden sm:block flex-1 max-w-40 h-px bg-white/15 overflow-hidden">
                <div data-hero-progress class="h-full bg-white origin-left" style="transform: scaleX(0)"></div>
            </div>
        </div>
    </div>

    <?php /* Стрелка «вниз» в углу кадра: показывает, что под первым экраном есть страница */ ?>
    <button type="button" data-hero-down aria-label="Прокрутить вниз" class="hidden lg:flex absolute left-0 bottom-0 w-[85px] h-[85px] items-center justify-center bg-ink-soft/90 text-white hover:bg-brand-red cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <?php echo invit_icon('arrow-down', 'w-6 h-6 motion-safe:animate-[nudge_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite]'); ?>
    </button>
</section>

<?php /* ---- Категории (CategoryTiles.tsx): плитка = снимок, название, счётчик ---- */ ?>
<section class="py-16 sm:py-20 bg-surface">
    <div class="max-w-[1340px] mx-auto px-5">
        <div data-reveal>
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <span class="text-xs font-semibold text-brand-green">Каталог</span>
                    <h2 class="mt-2 text-2xl sm:text-3xl font-bold text-ink tracking-tight">Категории продукции</h2>
                </div>
                <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors">
                    Весь каталог
                    <?php echo $arrow(); ?>
                </a>
            </div>
        </div>

        <div class="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <?php foreach (invit_sections() as $idx => $section) : $n = $counts['cat'][$section['slug']] ?? 0; ?>
                <div data-reveal data-delay="<?php echo esc_attr(min($idx * 0.07, 0.4)); ?>">
                    <a href="<?php echo esc_url(invit_url_category($section['slug'])); ?>" class="group flex h-full flex-col rounded-xl border border-line bg-white p-3 sm:p-4 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-brand-blue hover:shadow-lg">
                        <span class="grid aspect-[7/5] place-items-center overflow-hidden rounded-lg bg-white text-brand-blue">
                            <?php echo invit_section_mark($section['slug'], 96, 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]', true); ?>
                        </span>
                        <span class="flex flex-1 flex-col gap-1 pt-3">
                            <span class="text-xs sm:text-[13px] font-semibold leading-snug text-ink group-hover:text-brand-blue transition-colors"><?php echo esc_html($section['name']); ?></span>
                            <span class="mt-auto text-[11px] text-ink/45 tabular-nums"><?php echo esc_html($n . ' ' . invit_plural($n, ['позиция', 'позиции', 'позиций'])); ?></span>
                        </span>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php /* ---- Полоса преимуществ (BenefitsRow.tsx) ---- */ ?>
<section class="bg-surface-soft pt-10 sm:pt-14">
    <div class="max-w-[1340px] mx-auto px-5">
        <div data-reveal>
            <ul class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 rounded-xl border border-line bg-white px-5 py-8 sm:px-8 sm:py-10">
                <?php foreach ($benefits as $benefit) : ?>
                    <li class="flex flex-col items-center gap-3.5 text-center last:col-span-2 sm:last:col-span-1">
                        <img src="<?php echo esc_url($img($benefit['icon'])); ?>" alt="" aria-hidden="true" width="56" height="56" class="w-12 h-12 sm:w-14 sm:h-14 select-none">
                        <span class="text-xs sm:text-[13px] font-semibold leading-snug text-ink max-w-[16ch]"><?php echo esc_html($benefit['label']); ?></span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</section>

<?php /* ---- Каталог: ленты собственного производства ---- */ ?>
<section class="py-16 sm:py-24 bg-surface-soft">
    <div class="max-w-[1340px] mx-auto px-5">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
                <span class="text-xs font-semibold text-brand-green">Продукция</span>
                <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-ink tracking-tight">Каталог</h2>
            </div>
            <a href="<?php echo esc_url(invit_url_catalog()); ?>" class="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors">
                Весь каталог
                <?php echo $arrow(); ?>
            </a>
        </div>

        <?php invit_product_grid($own_tapes); ?>
    </div>
</section>

<?php /* ---- О компании (AboutIntro.tsx) ---- */ ?>
<section class="py-16 sm:py-24 bg-surface">
    <div class="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div data-reveal>
            <div class="rounded-[8px] border border-line bg-white overflow-hidden">
                <img src="<?php echo esc_url($img('about/about-tapes.webp')); ?>" alt="Уплотнительные и герметизирующие ленты EUROBAND в рулонах" loading="lazy" style="object-position: 65% 50%" class="w-full h-64 sm:h-80 lg:h-[420px] object-cover">
            </div>
        </div>

        <div data-reveal data-delay="0.12">
            <div class="xl:pr-24">
                <span class="text-xs font-semibold text-brand-green">Общество с ограниченной ответственностью «ИНВИТ»</span>
                <h2 class="mt-3 text-3xl sm:text-4xl font-bold text-ink tracking-tight leading-tight">
                    Уплотнительные ленты
                    <br class="hidden sm:block"> собственного производства
                </h2>
                <p class="mt-5 text-sm sm:text-base text-ink/70 leading-relaxed">
                    Производим монтажные, бутилкаучуковые, саморасширяющиеся ПСУЛ и уплотнительные ленты ПЭС
                    под маркой EUROBAND. По желанию клиента изготавливаем ленты нетипичных размеров на разных
                    основах и подложках.
                </p>
                <p class="mt-4 text-sm sm:text-base text-ink/70 leading-relaxed">
                    Сопутствующие материалы — пену, герметики, крепёж, инструмент и комплектующие для
                    вентиляции — поставляем напрямую от производителей.
                </p>
                <a href="<?php echo esc_url(home_url('/about/')); ?>" class="group mt-7 inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-green hover:text-brand-green-hover transition-colors">
                    Подробнее о компании
                    <?php echo $arrow('transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1'); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<?php /* ---- С 2001 года (SinceBlock.tsx) ---- */ ?>
<section class="relative bg-surface-soft overflow-hidden">
    <div class="max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2">
        <div data-reveal>
            <div class="relative z-10 py-16 sm:py-24 lg:pr-16">
                <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
                    Мы работаем на рынке строительных лент и уплотнителей с 2001 года.
                </h2>
                <p class="mt-6 text-sm sm:text-base text-ink/70 leading-relaxed">
                    За это время наладили собственное производство в Минске, подтвердили статус отечественного
                    производителя и наработали репутацию надёжного поставщика.
                </p>
                <p class="mt-4 text-sm sm:text-base text-ink/70 leading-relaxed">
                    Наши ленты применяются при монтаже окон и дверей, на фасадах, кровле и в системах
                    вентиляции — там, где шов должен оставаться герметичным годами.
                </p>

                <dl class="mt-10 grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
                    <?php foreach ($facts as $idx => $fact) : ?>
                        <div class="<?php echo $idx > 0 ? 'pl-4 sm:pl-6 border-l border-line' : ''; ?>">
                            <dt class="text-2xl sm:text-3xl font-bold text-ink tabular-nums leading-none"><?php echo (int) $fact['value']; ?></dt>
                            <dd class="mt-1.5 text-xs text-ink/55 leading-snug"><?php echo esc_html($fact['label']); ?></dd>
                        </div>
                    <?php endforeach; ?>
                </dl>
            </div>
        </div>

        <div data-reveal data-delay="0.12" class="h-full">
            <div class="h-full lg:-mr-5">
                <div class="h-full bg-brand-navy text-white/75 p-8 sm:p-12 lg:py-24">
                    <h3 class="text-xl sm:text-2xl font-bold text-white">Для нас важны:</h3>
                    <ul class="mt-6 space-y-4 text-sm sm:text-base leading-relaxed">
                        <?php foreach ($values as $value) : ?>
                            <li><?php echo esc_html($value); ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <p class="mt-8 text-sm sm:text-base leading-relaxed">
                        Мы последовательно расширяем ассортимент лент и географию поставок по Беларуси и странам
                        ЕАЭС.
                    </p>
                    <button type="button" data-callback="Связаться с нами — блок «Для нас важны»" class="mt-8 inline-flex items-center justify-center min-h-11 bg-white hover:bg-brand-green-soft text-brand-navy text-sm font-semibold rounded-[4px] px-7 cursor-pointer transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-px active:scale-[0.98]">
                        Связаться с нами
                    </button>
                </div>
            </div>
        </div>
    </div>
</section>

<?php /* ---- Новости (NewsGrid.tsx) ---- */ ?>
<?php if ($news) : ?>
<section class="py-16 sm:py-24 bg-surface">
    <div class="max-w-[1340px] mx-auto px-5">
        <div data-reveal>
            <h2 class="text-3xl sm:text-4xl font-bold text-ink tracking-tight text-center">Новости</h2>
        </div>

        <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php foreach ($news as $idx => $post_item) : ?>
                <div data-reveal data-delay="<?php echo esc_attr(min($idx * 0.07, 0.4)); ?>">
                    <article class="h-full">
                        <a href="<?php echo esc_url(get_permalink($post_item)); ?>" class="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lg">
                            <span class="block h-44 overflow-hidden bg-surface-soft">
                                <img src="<?php echo esc_url(invit_news_cover($post_item)); ?>" alt="" aria-hidden="true" loading="lazy" class="h-full w-full <?php echo esc_attr(invit_news_cover_fit($post_item)); ?> transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                            </span>
                            <span class="flex flex-1 flex-col p-5">
                                <span class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink/55">
                                    <span class="tabular-nums"><?php echo esc_html(get_the_date('j F Y', $post_item)); ?></span>
                                    <span class="text-brand-blue"><?php echo esc_html(invit_news_category($post_item)); ?></span>
                                </span>
                                <span class="mt-3 block text-sm font-semibold leading-snug text-ink group-hover:text-brand-blue transition-colors"><?php echo esc_html(get_the_title($post_item)); ?></span>
                                <span class="mt-2 block text-xs leading-relaxed text-ink/60"><?php echo esc_html(invit_news_excerpt($post_item)); ?></span>
                            </span>
                        </a>
                    </article>
                </div>
            <?php endforeach; ?>
        </div>

        <div class="mt-12 text-center">
            <a href="<?php echo esc_url(home_url('/news/')); ?>" class="inline-flex items-center gap-2 min-h-11 sm:min-h-0 text-xs font-semibold uppercase tracking-[0.14em] text-ink hover:text-brand-blue transition-colors">
                Ко всем новостям
                <?php echo $arrow(); ?>
            </a>
        </div>
    </div>
</section>
<?php endif; ?>

<?php /* ---- Форма расчёта на фото (ContactBanner.tsx) ---- */ ?>
<section class="relative bg-ink overflow-hidden">
    <img src="<?php echo esc_url($img('hero/pes-rolls-macro.webp')); ?>" alt="" aria-hidden="true" loading="lazy" class="absolute inset-0 w-full h-full object-cover">
    <div class="absolute inset-0 bg-gradient-to-r from-ink/90 from-10% via-ink/60 via-45% to-ink/20 to-80%"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 via-35% to-ink/30 lg:hidden"></div>

    <div class="relative max-w-[1340px] mx-auto px-5 grid lg:grid-cols-2 gap-10 lg:gap-16 py-16 sm:py-24 items-center">
        <div data-reveal>
            <div>
                <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">Подберём ленту под задачу и посчитаем объём</h2>
                <p class="mt-6 text-sm sm:text-base text-white/75 leading-relaxed">
                    Если нужен нетиповой размер или вы не уверены, какая лента подойдёт, опишите
                    задачу. Ответим по наличию, ценам и срокам.
                </p>

                <dl class="mt-8 space-y-4 text-sm">
                    <div class="flex items-start gap-3">
                        <dt class="mt-0.5"><?php echo invit_icon('phone', 'w-4 h-4 text-brand-blue'); ?><span class="sr-only">Телефон</span></dt>
                        <dd>
                            <a href="tel:+375296444979" class="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-white hover:text-white/70 transition-colors whitespace-nowrap">+375 29 644-49-79</a><span class="ml-2 text-white/50">многоканальный</span>
                        </dd>
                    </div>
                    <div class="flex items-start gap-3">
                        <dt class="mt-0.5"><?php echo invit_icon('mail', 'w-4 h-4 text-brand-blue'); ?><span class="sr-only">Почта</span></dt>
                        <dd><a href="mailto:info@invit.by" class="inline-flex items-center min-h-11 sm:min-h-0 font-semibold text-white hover:text-white/70 transition-colors">info@invit.by</a></dd>
                    </div>
                    <div class="flex items-start gap-3">
                        <dt class="mt-0.5"><?php echo invit_icon('map-pin', 'w-4 h-4 text-brand-blue'); ?><span class="sr-only">Адрес</span></dt>
                        <dd class="text-white/75 leading-relaxed">
                            Минский район, Сеницкий сельсовет, 84 (ТЦ «Сеница», офис 9)
                            <br>
                            Солигорск, улица Строителей, 30, офис 101
                        </dd>
                    </div>
                </dl>
            </div>
        </div>

        <div data-reveal data-delay="0.12">
            <div class="bg-white border border-inv-border rounded-[8px] p-6 sm:p-8 shadow-xl">
                <?php get_template_part('template-parts/request-form', null, ['id' => 'glavnaya']); ?>
            </div>
        </div>
    </div>
</section>

<?php /* ---- Полоса документов (CertificatesStrip.tsx) ---- */ ?>
<section class="py-14 bg-surface-soft border-y border-line">
    <div class="max-w-[1340px] mx-auto px-5">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
                <span class="text-xs font-semibold text-brand-green">Документы</span>
                <h2 class="mt-2 text-2xl font-bold text-ink tracking-tight">Качество подтверждено</h2>
            </div>
            <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors">
                Все документы
                <?php echo $arrow(); ?>
            </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <?php foreach ($certificates as $idx => $cert) : ?>
                <div data-reveal data-delay="<?php echo esc_attr(min($idx * 0.07, 0.4)); ?>">
                    <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="block h-full group bg-white border border-line rounded-xl p-3 hover:border-brand-green hover:-translate-y-1 hover:shadow-lg transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <div class="aspect-3/4 overflow-hidden rounded-lg bg-white">
                            <img src="<?php echo esc_url($img('certificates/' . $cert['id'] . '.webp')); ?>" alt="<?php echo esc_attr($cert['title']); ?>" loading="lazy" class="w-full h-full object-contain group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        </div>
                        <span class="mt-3 block text-xs text-ink/70 leading-snug line-clamp-2"><?php echo esc_html($cert['title']); ?></span>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
