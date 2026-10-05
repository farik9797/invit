<?php
/**
 * Template Name: О компании
 *
 * Кто мы, чем занимаемся и по каким документам работаем. Значения по умолчанию
 * повторяют нынешний сайт: страница читается и до заполнения полей.
 */

if (!defined('ABSPATH')) exit;

get_header();

$lead = invit_field('lead', 'ООО «ИНВИТ» выпускает уплотнительные и герметизирующие ленты под собственной маркой EUROBAND с 2001 года. Сопутствующие материалы поставляем напрямую от производителей.');

$facts = invit_field('facts', [
    ['value' => (string) (int) (date('Y') - 2001), 'label' => 'лет на рынке'],
    ['value' => '13', 'label' => 'разделов каталога'],
    ['value' => '2', 'label' => 'склада отгрузки'],
    ['value' => '10-500 мм', 'label' => 'ширина реза ленты'],
]);

$production = invit_field('production', [
    [
        'value' => '10-500 мм',
        'title' => 'Ширина ленты',
        'text'  => 'Режем под задачу. Если типоразмера в каталоге нет, изготовим нетиповой размер под ваш проект.',
    ],
    [
        'value' => 'Акрил и бутилкаучук',
        'title' => 'Клеевые слои',
        'text'  => 'Наносим клейкие полосы с одной или с двух сторон, на разных основах и подложках.',
    ],
    [
        'value' => '2 склада',
        'title' => 'Отгрузка',
        'text'  => 'Минск, Солигорск.',
    ],
]);

$standards = invit_field('standards', [
    ['line' => 'ТКП 45-3.02-223-2010, монтаж оконных блоков'],
    ['line' => 'ГОСТ 30971-2002, швы монтажные узлов примыкания'],
    ['line' => 'ГОСТ 30247.0-94, испытания на огнестойкость'],
    ['line' => 'СТБ 1108-98, ленты уплотнительные самоклеящиеся'],
]);

$requisites = invit_field('requisites_full', [
    ['label' => 'Полное название', 'value' => 'Общество с ограниченной ответственностью «ИНВИТ»'],
    ['label' => 'УНП', 'value' => '600500616'],
    ['label' => 'Юридический адрес', 'value' => 'Минская область, город Солигорск, улица Строителей, 30, офис 101'],
    ['label' => 'Расчётный счёт', 'value' => 'BY69ALFA30122D67570010270000, ЗАО «Альфа-Банк»'],
    ['label' => 'Директор', 'value' => 'Абрамович Валерий Иванович'],
]);
?>

<section class="bg-inv-deep text-white">
    <div class="max-w-[1340px] mx-auto px-5 py-10 sm:py-14 lg:py-16">
        <h1 class="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.01em] leading-[1.1] max-w-3xl">
            <?php the_title(); ?>
        </h1>
        <p class="mt-5 text-base sm:text-lg leading-[1.55] text-inv-on-deep max-w-[65ch]">
            <?php echo esc_html($lead); ?>
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <button type="button" data-request class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] bg-white text-inv-deep text-sm font-semibold hover:bg-inv-surface-1 transition-colors duration-[120ms] cursor-pointer">
                Запросить презентацию
            </button>
            <a href="<?php echo esc_url(function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/')); ?>" class="inline-flex items-center justify-center min-h-11 h-12 px-6 rounded-[4px] border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors duration-[120ms]">
                Смотреть каталог
            </a>
        </div>
    </div>
</section>

<?php if ($facts) : ?>
    <section class="bg-white border-b border-inv-border">
        <dl class="max-w-[1340px] mx-auto px-5 py-10 sm:py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <?php foreach ($facts as $i => $fact) : ?>
                <div class="<?php echo $i > 0 ? 'lg:pl-8 lg:border-l lg:border-inv-border' : ''; ?>">
                    <dt class="text-[26px] sm:text-[32px] font-semibold text-inv-ink leading-none"><?php echo esc_html($fact['value']); ?></dt>
                    <dd class="mt-2 text-sm text-inv-ink-muted max-w-[22ch]"><?php echo esc_html($fact['label']); ?></dd>
                </div>
            <?php endforeach; ?>
        </dl>
    </section>
<?php endif; ?>

<?php if (get_the_content()) : ?>
    <section class="bg-white py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5">
            <div class="max-w-[70ch] text-base leading-[1.6] text-inv-ink-muted [&_p]:mt-4 [&_p:first-child]:mt-0 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-inv-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1">
                <?php while (have_posts()) : the_post(); the_content(); endwhile; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<?php if ($production) : ?>
    <section class="bg-inv-surface-1 py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div class="lg:col-span-5">
                <div class="lg:sticky lg:top-[150px]">
                    <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-inv-ink">Производство и отгрузка</h2>
                    <p class="mt-5 text-base leading-[1.55] text-inv-ink-muted max-w-[46ch]">
                        Режем ленты под задачу заказчика и держим ходовые позиции на складе.
                        Нетиповой размер считаем отдельно.
                    </p>
                </div>
            </div>

            <div class="lg:col-span-7 space-y-6">
                <?php foreach ($production as $block) : ?>
                    <div class="rounded-[8px] border border-inv-border bg-white p-5 sm:p-6">
                        <span class="block text-xl font-semibold text-inv-blue"><?php echo esc_html($block['value']); ?></span>
                        <h3 class="mt-1 text-sm font-semibold text-inv-ink"><?php echo esc_html($block['title']); ?></h3>
                        <p class="mt-2 text-sm leading-relaxed text-inv-ink-muted"><?php echo esc_html($block['text']); ?></p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
<?php endif; ?>

<?php if ($standards) : ?>
    <section class="bg-inv-deep text-white py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div class="lg:col-span-5">
                <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em]">Стандарты и документы</h2>
                <p class="mt-5 text-base leading-[1.55] text-inv-on-deep max-w-[46ch]">
                    Ленты применяются при монтаже светопрозрачных конструкций и
                    соответствуют нормам, на которые ссылаются технические свидетельства.
                </p>
                <a href="<?php echo esc_url(home_url('/certificates/')); ?>" class="mt-6 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-white hover:text-inv-on-deep transition-colors duration-[120ms]">
                    Все документы
                    <?php echo invit_icon('arrow-right', 'w-4 h-4'); ?>
                </a>
            </div>

            <ul class="lg:col-span-7 space-y-3">
                <?php foreach ($standards as $row) : ?>
                    <li class="flex items-start gap-3 text-sm leading-relaxed text-inv-on-deep">
                        <span class="mt-1.5 w-1.5 h-1.5 shrink-0 rounded-full bg-inv-red"></span>
                        <?php echo esc_html(is_array($row) ? ($row['line'] ?? '') : $row); ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </section>
<?php endif; ?>

<?php if ($requisites) : ?>
    <section class="bg-white py-12 sm:py-16">
        <div class="max-w-[1340px] mx-auto px-5">
            <h2 class="text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-inv-ink">Реквизиты компании</h2>

            <dl class="mt-6 max-w-[860px] rounded-[8px] border border-inv-border divide-y divide-inv-border-subtle overflow-hidden">
                <?php foreach ($requisites as $row) : ?>
                    <div class="flex flex-col sm:flex-row gap-1 sm:gap-6 px-4 py-3 text-sm">
                        <dt class="sm:w-56 shrink-0 text-inv-ink-muted"><?php echo esc_html($row['label']); ?></dt>
                        <dd class="text-inv-ink break-words"><?php echo esc_html($row['value']); ?></dd>
                    </div>
                <?php endforeach; ?>
            </dl>
        </div>
    </section>
<?php endif; ?>

<?php get_footer(); ?>
