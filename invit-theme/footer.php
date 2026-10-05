<?php
/**
 * Подвал: контакты, разделы сайта, краткие реквизиты. Отдельной строкой —
 * оговорка о том, что сайт не торгует в розницу: она должна быть на каждой
 * странице, подробная версия стоит в заявке перед кнопкой отправки.
 */

if (!defined('ABSPATH')) exit;

$contacts = invit_contacts();
$logo_light = get_template_directory_uri() . '/assets/img/invit-light.svg';

$footer_nav = [
    ['label' => 'Каталог', 'url' => function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : home_url('/catalog/')],
    ['label' => 'О компании', 'url' => home_url('/about/')],
    ['label' => 'Документация', 'url' => home_url('/certificates/')],
    ['label' => 'Новости', 'url' => home_url('/news/')],
    ['label' => 'Контакты', 'url' => home_url('/contacts/')],
];

$requisites = invit_option('requisites', [
    ['line' => 'ООО «ИНВИТ», УНП 600500616'],
    ['line' => 'Минская обл., г. Солигорск, ул. Строителей, 30, оф. 101'],
    ['line' => 'р/с BY69ALFA30122D67570010270000, ЗАО «Альфа-Банк»'],
    ['line' => 'Директор Абрамович Валерий Иванович'],
]);

$disclaimer = invit_option(
    'disclaimer',
    'Сайт носит информационный характер, не является интернет-магазином и публичной офертой. '
    . 'Продажа товаров физическим лицам (розничная торговля) не осуществляется: работаем с юридическими '
    . 'лицами и индивидуальными предпринимателями по счёт-фактуре.'
);
?>
</main>

<footer class="bg-inv-deep text-inv-on-deep">
    <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div class="space-y-4">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center min-h-11">
                <img src="<?php echo esc_url($logo_light); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" class="h-10 w-auto" width="150" height="40">
            </a>

            <p class="text-sm leading-relaxed max-w-xs">
                <?php echo esc_html(invit_option('footer_about', 'Белорусский производитель уплотнительных и герметизирующих лент EUROBAND. Сопутствующие материалы поставляем напрямую от производителей.')); ?>
            </p>

            <div class="flex flex-col sm:gap-1">
                <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_minsk'])); ?>" class="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo esc_html($contacts['phone_minsk']); ?>
                    <span class="text-xs font-normal text-white/55">Минск</span>
                </a>
                <a href="tel:<?php echo esc_attr(invit_tel($contacts['phone_soligorsk'])); ?>" class="flex items-baseline gap-2 min-h-11 sm:min-h-0 text-base font-semibold text-white hover:text-white/80 transition-colors duration-[120ms] whitespace-nowrap">
                    <?php echo esc_html($contacts['phone_soligorsk']); ?>
                    <span class="text-xs font-normal text-white/55">Солигорск</span>
                </a>
                <a href="mailto:<?php echo esc_attr($contacts['email']); ?>" class="flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]">
                    <?php echo esc_html($contacts['email']); ?>
                </a>
                <a href="<?php echo esc_url($contacts['telegram']); ?>" target="_blank" rel="noopener" class="flex items-center gap-2 min-h-11 sm:min-h-0 sm:mt-1 text-sm hover:text-white transition-colors duration-[120ms]">
                    <?php echo invit_icon('send', 'w-4 h-4 shrink-0'); ?>
                    Заявка в Telegram
                </a>
            </div>
        </div>

        <div class="space-y-3 text-sm">
            <h2 class="text-white font-semibold">Разделы</h2>
            <?php /* На телефоне ссылки подвала тоже цель для пальца: 44px хватает
                     и как разделителя, поэтому вертикальные отступы там убраны. */ ?>
            <nav class="flex flex-col sm:gap-3" aria-label="Меню подвала">
                <?php foreach ($footer_nav as $item) : ?>
                    <a href="<?php echo esc_url($item['url']); ?>" class="flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms]">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        </div>

        <div class="space-y-3 text-sm">
            <h2 class="text-white font-semibold">Реквизиты</h2>

            <ul class="space-y-2 text-[13px] leading-[1.5] text-white/70">
                <?php foreach ((array) $requisites as $row) : ?>
                    <li class="break-words"><?php echo esc_html(is_array($row) ? ($row['line'] ?? '') : $row); ?></li>
                <?php endforeach; ?>
            </ul>

            <a href="<?php echo esc_url(home_url('/about/')); ?>" class="inline-flex items-center min-h-11 sm:min-h-0 text-sm hover:text-white transition-colors duration-[120ms]">
                Все реквизиты и документы
            </a>
        </div>
    </div>

    <div class="border-t border-white/15">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-4 text-xs leading-relaxed text-white/60">
            <?php echo esc_html($disclaimer); ?>
        </div>
    </div>

    <div class="border-t border-white/15">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8 py-5 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6">
            <span>© 2001-<?php echo esc_html(date('Y')); ?> ООО «ИНВИТ». Все права защищены.</span>
            <a href="<?php echo esc_url(home_url('/privacy/')); ?>" class="inline-flex items-center min-h-11 sm:min-h-0 hover:text-white transition-colors duration-[120ms] whitespace-nowrap">
                Политика конфиденциальности
            </a>
        </div>
    </div>
</footer>

<?php get_template_part('template-parts/modal-request'); ?>
<?php get_template_part('template-parts/modal-search'); ?>

<?php wp_footer(); ?>
</body>
</html>
