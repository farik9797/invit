<?php
/**
 * Тема ООО «ИНВИТ»: подключение стилей, поддержка WooCommerce, помощники
 * вывода полей ACF. Разметка страниц лежит в шаблонах рядом.
 */

if (!defined('ABSPATH')) exit;

define('INVIT_VERSION', '1.0.0');

require_once get_template_directory() . '/inc/data.php';
require_once get_template_directory() . '/inc/icons.php';
require_once get_template_directory() . '/inc/catalog.php';
require_once get_template_directory() . '/inc/catalog-page.php';
require_once get_template_directory() . '/inc/forms.php';
require_once get_template_directory() . '/inc/leads.php';
require_once get_template_directory() . '/inc/mail.php';
require_once get_template_directory() . '/inc/news.php';
require_once get_template_directory() . '/inc/migrations.php';
require_once get_template_directory() . '/inc/admin.php';
require_once get_template_directory() . '/inc/acf-fields.php';
require_once get_template_directory() . '/inc/checkout.php';
require_once get_template_directory() . '/inc/permalinks.php';
require_once get_template_directory() . '/inc/setup.php';

/**
 * Значение поля ACF с запасным вариантом.
 *
 * Запасной текст — тот же, что стоит на нынешнем сайте: страница выглядит
 * правильно ещё до того, как редактор заполнит поля.
 */
function invit_field($key, $default = '', $post_id = null) {
    if (function_exists('get_field')) {
        $value = get_field($key, $post_id);
        if ($value !== null && $value !== '' && $value !== false && $value !== []) {
            return $value;
        }
    }
    return $default;
}

/** Значение из общих настроек сайта (ACF Options Page). */
function invit_option($key, $default = '') {
    return invit_field($key, $default, 'option');
}

/** Телефон в виде, пригодном для ссылки tel:. */
function invit_tel($phone) {
    return preg_replace('/[^\d+]/', '', $phone);
}

function invit_setup() {
    load_theme_textdomain('invit', get_template_directory() . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo', ['height' => 44, 'flex-width' => true]);

    // Витрину рисуем своими шаблонами, но галерея карточки — родная Woo.
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary' => 'Меню в шапке',
        'footer'  => 'Меню в подвале',
    ]);
}
add_action('after_setup_theme', 'invit_setup');

function invit_assets() {
    $css = get_template_directory() . '/assets/css/app.css';
    wp_enqueue_style(
        'invit-app',
        get_template_directory_uri() . '/assets/css/app.css',
        [],
        file_exists($css) ? filemtime($css) : INVIT_VERSION
    );

    // Onest — как в index.html React-сайта, но файлы шрифта лежат в теме:
    // сайт не обращается к серверам Google.
    $fonts = get_template_directory() . '/assets/fonts/onest/onest.css';
    wp_enqueue_style(
        'invit-fonts',
        get_template_directory_uri() . '/assets/fonts/onest/onest.css',
        [],
        file_exists($fonts) ? filemtime($fonts) : INVIT_VERSION
    );

    $js = get_template_directory() . '/assets/js/site.js';
    wp_enqueue_script(
        'invit-site',
        get_template_directory_uri() . '/assets/js/site.js',
        [],
        file_exists($js) ? filemtime($js) : INVIT_VERSION,
        true
    );
    wp_localize_script('invit-site', 'INVIT', invit_script_config());
}
add_action('wp_enqueue_scripts', 'invit_assets');

/**
 * Корзина у нас не розничная: это лист заявки на счёт-фактуру. Поэтому цены
 * скрывать не надо, а вот подписи кнопок меняем на «В заявку».
 */
function invit_add_to_cart_text() {
    return 'В заявку';
}
add_filter('woocommerce_product_add_to_cart_text', 'invit_add_to_cart_text');
add_filter('woocommerce_product_single_add_to_cart_text', 'invit_add_to_cart_text');

/*
 * Цены на витрине выключены, как на React-сайте (src/lib/price.ts, PRICES_SHOWN):
 * клиент попросил показывать «по запросу» у всех позиций. Цены остаются в базе
 * и попадают в заказ — менеджеру, но не посетителю.
 */
function invit_empty_price($price, $product) {
    return 'Цена по запросу';
}
add_filter('woocommerce_get_price_html', 'invit_empty_price', 10, 2);

/**
 * Раскладочные стили WooCommerce мешают: правило «.woocommerce img {height:auto}»
 * идёт без CSS-слоя и перебивает утилиты Tailwind, из-за чего у логотипа и
 * снимков слетала заданная высота. Сетки и колонки мы рисуем сами, поэтому
 * оставляем только общий файл с кнопками, сообщениями и таблицами.
 */
function invit_drop_woo_layout() {
    wp_dequeue_style('woocommerce-layout');
    wp_dequeue_style('woocommerce-smallscreen');
    wp_dequeue_style('woocommerce-general');
}
add_action('wp_enqueue_scripts', 'invit_drop_woo_layout', 20);

/*
 * Скрипты WooCommerce тема не использует: корзина, поиск и заявка работают
 * через site.js. Без них не грузятся jQuery и 150 КБ справочника стран на
 * странице заявки. «Атрибуция заказов» (sourcebuster) ставит отслеживающие
 * cookie без согласия — источники визитов и так видят Метрика и GA4.
 */
function invit_drop_woo_scripts() {
    $handles = [
        'wc-add-to-cart', 'woocommerce', 'wc-cart-fragments', 'wc-cart', 'wc-checkout',
        'wc-country-select', 'wc-address-i18n', 'selectWoo', 'jquery-blockui', 'js-cookie',
        'sourcebuster-js', 'wc-order-attribution',
    ];
    foreach ($handles as $handle) wp_dequeue_script($handle);
    wp_dequeue_style('select2');
}
add_action('wp_enqueue_scripts', 'invit_drop_woo_scripts', 100);

/* Эмодзи WordPress: на React-сайте их нет, а скрипт грузится на каждой странице */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/*
 * Счётчики: Яндекс.Метрика 54452731 (тот же, что стоял на старом invit.by,
 * статистика продолжается) и Google Analytics 4 G-1Y6VH54HTZ. Грузятся только
 * после согласия на cookie: «Принять» в плашке (template-parts/cookie-banner.php)
 * ставит invit_consent=all и вызывает invitCounters(). Только на боевом адресе:
 * локальная копия и тестовые стенды визиты не шлют. Политика конфиденциальности
 * (page-privacy.php) описывает оба — меняете счётчики, правьте и политику.
 */
function invit_counters() {
    if (parse_url(home_url(), PHP_URL_HOST) !== 'invit.by') return;
    ?>
<script>
window.invitCounters = function () {
    if (window.invitCounters.on) return;
    window.invitCounters.on = true;

    /* Yandex.Metrika counter */
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=54452731', 'ym');
    ym(54452731, 'init', {webvisor:true, clickmap:true, referrer:document.referrer, url:location.href, accurateTrackBounce:true, trackLinks:true});

    /* Google tag (gtag.js) */
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=G-1Y6VH54HTZ';
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){dataLayer.push(arguments);};
    gtag('js', new Date());
    gtag('config', 'G-1Y6VH54HTZ');

    /* Каталог меняет адрес без перезагрузки (site.js, softNav): Метрике нужен
       отдельный просмотр, GA4 смену адреса видит сам */
    var last = location.href;
    document.addEventListener('invit:pageview', function () {
        ym(54452731, 'hit', location.href, {title: document.title, referer: last});
        last = location.href;
    });
};
if (/(?:^|;\s*)invit_consent=all(?:;|$)/.test(document.cookie)) window.invitCounters();
</script>
    <?php
}
add_action('wp_head', 'invit_counters', 1);

/** Первая ссылка в хлебных крошках — по-русски. */
function invit_breadcrumb_home($defaults) {
    $defaults['home'] = 'Главная';
    return $defaults;
}
add_filter('woocommerce_breadcrumb_defaults', 'invit_breadcrumb_home');

/**
 * Цены в белорусских рублях: сумма, пробел, «р.» — как в счетах клиента.
 * Настройка живёт в коде темы, чтобы перенос на другой сервер не терял её.
 */
function invit_price_format($format, $pos) {
    return '%2$s&nbsp;%1$s';
}
add_filter('woocommerce_price_format', 'invit_price_format', 10, 2);

function invit_currency_symbol($symbol, $currency) {
    return $currency === 'BYN' ? 'р.' : $symbol;
}
add_filter('woocommerce_currency_symbol', 'invit_currency_symbol', 10, 2);

/** Сколько позиций (строк) в заявке — для значка в шапке, как в React. */
function invit_cart_count() {
    if (!function_exists('WC') || !WC()->cart) return 0;
    return count(WC()->cart->get_cart());
}

/*
 * Типографская замена WordPress выключена: React-сайт выводит текст как есть,
 * и «ООО "ИНВИТ"» превращалось в «ООО «ИНВИТ»», а «10x100» в артикуле — в «10×100».
 */
add_filter('run_wptexturize', '__return_false');

/** Каталог и карточки товаров: там нет медали «2013» (LayoutV2). */
function invit_is_catalog_page() {
    return function_exists('is_woocommerce') && (is_shop() || is_product_taxonomy() || is_product()
        || (is_search() && get_query_var('post_type') === 'product'));
}
