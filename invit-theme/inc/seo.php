<?php
/**
 * Мета-теги через Yoast SEO: заголовок и описание по типу страницы из данных
 * каталога — главная, каталог, раздел, подраздел, товар, страницы, новости.
 * Заполненное вручную в Yoast (у товара, раздела, страницы) важнее: шаблон
 * подставляется, только когда поле пустое. Подраздел с адресом ?sub= получает
 * свой заголовок и канонический адрес /catalog/<подраздел>/ — тот, что в
 * карте сайта. В текстах — только то, что написано на самом сайте.
 */

if (!defined('ABSPATH')) exit;

const INVIT_SEO_SUFFIX = ' — купить в Минске | ИНВИТ';
const INVIT_SEO_TERMS = 'Цены по запросу, счёт для юрлиц и ИП.';

/** Страницы сайта по адресу: заголовок и описание. */
function invit_seo_pages() {
    return [
        'about' => [
            'title' => 'О компании ИНВИТ — производитель лент EUROBAND с 2001 года',
            'desc' => 'ООО «ИНВИТ» с 2001 года выпускает ленты EUROBAND и поставляет пену, герметики, крепёж и инструмент напрямую от производителей.',
        ],
        'contacts' => [
            'title' => 'Контакты ИНВИТ — офисы и склады в Минске и Солигорске',
            'desc' => 'Телефоны, адреса и часы работы ООО «ИНВИТ» в Минске и Солигорске, реквизиты и форма запроса расчёта. Ответим по наличию, ценам и срокам.',
        ],
        'certificates' => [
            'title' => 'Документы на ленты EUROBAND: сертификаты и декларации | ИНВИТ',
            'desc' => 'Сертификаты, технические свидетельства и декларации о соответствии на ленты EUROBAND ВЛ, НЛ, ПСУЛ, ПЭС. Паспорт качества — к каждой партии.',
        ],
        'bestsel' => [
            'title' => 'Лучший строительный продукт года — 2013: ленты EUROBAND | ИНВИТ',
            'desc' => 'Монтажные ленты EUROBAND признаны лучшим продуктом года в категории «Клеевые и герметизирующие материалы» республиканского конкурса 2013 года.',
        ],
        'privacy' => [
            'title' => 'Политика конфиденциальности | ИНВИТ',
            'desc' => 'Как ООО «ИНВИТ» обрабатывает данные, которые вы оставляете на сайте invit.by: заявки, cookie, статистика посещений.',
        ],
    ];
}

/** Какая страница открыта и её данные; null — мета-теги Yoast как есть. */
function invit_seo_page() {
    static $page = false;
    if ($page !== false) return $page;
    $page = null;

    if (is_front_page()) {
        $page = ['type' => 'home', 'post' => (int) get_option('page_on_front')];
    } elseif (function_exists('is_product') && is_product()) {
        $item = invit_catalog_item_by_id(get_queried_object_id());
        if ($item) $page = ['type' => 'product', 'post' => $item[INVIT_I_ID], 'item' => $item];
    } elseif (function_exists('is_shop') && (is_shop() || is_product_category())) {
        [$category, $filters] = invit_catalog_context();
        $sub = $filters['sub'];
        $page = [
            'type' => $sub ? 'sub' : ($category ? 'section' : 'catalog'),
            'category' => $category,
            'sub' => $sub,
            'term' => ($sub || $category) ? get_term_by('slug', $sub ?: $category, 'product_cat') : null,
            'post' => $category ? 0 : (int) wc_get_page_id('shop'),
        ];
    } elseif (is_home()) {
        $page = ['type' => 'news', 'post' => (int) get_option('page_for_posts')];
    } elseif (is_singular('post')) {
        $page = ['type' => 'post', 'post' => get_queried_object_id()];
    } elseif (is_page()) {
        $page = ['type' => 'page', 'post' => get_queried_object_id(), 'slug' => get_post_field('post_name', get_queried_object_id())];
    }
    return $page;
}

/** Заполненное вручную в Yoast поле ('title' или 'metadesc'), с подстановкой переменных. */
function invit_seo_manual(array $page, $field) {
    if (!empty($page['term'])) {
        if (!class_exists('WPSEO_Taxonomy_Meta')) return '';
        $value = WPSEO_Taxonomy_Meta::get_term_meta($page['term'], 'product_cat', $field === 'metadesc' ? 'desc' : 'title');
        $object = $page['term'];
    } elseif (!empty($page['post'])) {
        $value = get_post_meta($page['post'], '_yoast_wpseo_' . $field, true);
        $object = get_post($page['post']);
    } else {
        return '';
    }
    $value = is_string($value) ? trim($value) : '';
    return ($value !== '' && function_exists('wpseo_replace_vars')) ? wpseo_replace_vars($value, $object) : $value;
}

/** Первая буква строчной, если это не аббревиатура («Силиконовые» -> «силиконовые», «СИЗ» остаётся). */
function invit_seo_lcfirst($text) {
    $second = mb_substr($text, 1, 1);
    return $second !== '' && mb_strtolower($second) === $second
        ? mb_strtolower(mb_substr($text, 0, 1)) . mb_substr($text, 1)
        : $text;
}

/** Текст не длиннее $limit: по концу предложения, иначе по слову с многоточием. */
function invit_seo_trim($text, $limit = 160) {
    $text = trim(preg_replace('/\s+/u', ' ', html_entity_decode(wp_strip_all_tags((string) $text), ENT_QUOTES, 'UTF-8')));
    if (mb_strlen($text) <= $limit) return $text;
    $cut = mb_substr($text, 0, $limit);
    $dot = max(mb_strrpos($cut, '. '), mb_strrpos($cut, '! '), mb_strrpos($cut, '? '));
    if ($dot !== false && $dot > $limit * 0.5) return mb_substr($cut, 0, $dot + 1);
    $space = mb_strrpos($cut, ' ');
    return preg_replace('/[.,;:!?\s—-]+$/u', '', mb_substr($cut, 0, $space ?: $limit - 1)) . '…';
}

/** Название подраздела для заголовка: «Силиконовые» -> «Герметики силиконовые». */
function invit_seo_sub_label($category, $sub) {
    $name = trim(invit_sub_name($sub));
    $section = invit_section($category)['name'] ?? '';
    if (str_contains($name, ' ') || $section === '') return $name;
    // Прилагательное без раздела непонятно: «Акриловые» — что именно
    if (preg_match('/(ые|ый|ая|ое)$/u', $name)) return $section . ' ' . invit_seo_lcfirst($name);
    return $name . ': ' . invit_seo_lcfirst($section);
}

/** Сколько позиций и какие бренды чаще всего в разделе или подразделе. */
function invit_seo_scope($category, $sub) {
    $total = 0;
    $brands = [];
    foreach (invit_catalog_items() as $item) {
        if ($sub ? !invit_in_sub($item, $sub) : !invit_in_category($item, $category)) continue;
        $total++;
        if ($item[INVIT_I_BRAND] !== '') $brands[$item[INVIT_I_BRAND]] = ($brands[$item[INVIT_I_BRAND]] ?? 0) + 1;
    }
    arsort($brands);
    return [$total, array_slice(array_keys($brands), 0, 3)];
}

/** Сколько товаров с тем же названием и тем же кратким описанием — для уникальности мета. */
function invit_seo_repeats() {
    static $repeats = null;
    if ($repeats !== null) return $repeats;
    $repeats = ['title' => [], 'desc' => []];
    foreach (invit_catalog_items() as $item) {
        $repeats['title'][$item[INVIT_I_TITLE]] = ($repeats['title'][$item[INVIT_I_TITLE]] ?? 0) + 1;
        $desc = trim($item[INVIT_I_DESC]);
        if ($desc !== '') $repeats['desc'][$desc] = ($repeats['desc'][$desc] ?? 0) + 1;
    }
    return $repeats;
}

function invit_seo_count($n) {
    return number_format($n, 0, '', ' ') . ' ' . invit_plural($n, ['позиция', 'позиции', 'позиций']);
}

/** Заголовок по шаблону; null — оставить Yoast. */
function invit_seo_title(array $page) {
    switch ($page['type']) {
        case 'home':
            return 'Ленты EUROBAND оптом от производителя в Минске — ИНВИТ';
        case 'catalog':
            return 'Каталог: ленты EUROBAND, герметики, пена, крепёж, инструмент | ИНВИТ';
        case 'section':
            return (invit_section($page['category'])['name'] ?? '') . INVIT_SEO_SUFFIX;
        case 'sub':
            return invit_seo_sub_label($page['category'], $page['sub']) . INVIT_SEO_SUFFIX;
        case 'product':
            $item = $page['item'];
            $name = rtrim($item[INVIT_I_TITLE], '. ');
            // Одинаковые названия у разных товаров различает артикул
            if ((invit_seo_repeats()['title'][$item[INVIT_I_TITLE]] ?? 0) > 1 && $item[INVIT_I_SKU] !== '') {
                $name .= ', арт. ' . $item[INVIT_I_SKU];
            }
            // Длинное название поставщика — хвост короче, иначе обрежется в выдаче
            return $name . (mb_strlen($name) <= 44 ? INVIT_SEO_SUFFIX : ' | ИНВИТ');
        case 'news':
            return 'Новости компании ИНВИТ';
        case 'post':
            return get_the_title($page['post']) . ' | ИНВИТ';
        case 'page':
            return invit_seo_pages()[$page['slug']]['title'] ?? null;
    }
    return null;
}

/** Описание по шаблону; null — оставить Yoast. */
function invit_seo_description(array $page) {
    switch ($page['type']) {
        case 'home':
            return 'Производитель лент EUROBAND в Беларуси: монтажные ленты для окон, ПСУЛ, бутиловые и ПЭС. Оптовые цены, документы по качеству, счёт для юрлиц и ИП.';
        case 'catalog':
            return 'Каталог ИНВИТ — ' . invit_seo_count(invit_catalog_counts()['all'])
                . ': ленты EUROBAND собственного производства, герметики, монтажная пена, крепёж, инструмент. ' . INVIT_SEO_TERMS;
        case 'section':
        case 'sub':
            // Тексты разделов со старого сайта начинаются по-разному («В соответствии
            // с ТКП…») — для выдачи понятнее одинаковый шаблон из цифр каталога
            [$total, $brands] = invit_seo_scope($page['category'], $page['sub']);
            $name = $page['type'] === 'sub' ? invit_seo_sub_label($page['category'], $page['sub']) : invit_section($page['category'])['name'];
            return $name . ' в каталоге ИНВИТ: ' . invit_seo_count($total)
                . ($brands ? ', бренды ' . implode(', ', $brands) : '') . '. ' . INVIT_SEO_TERMS;
        case 'product':
            $item = $page['item'];
            // Текст до линии «Далее» — тот, что у фото на странице товара
            $text = explode('<!--more-->', (string) get_post_field('post_content', $page['post']), 2)[0];
            if (mb_strlen(trim(wp_strip_all_tags($text))) < 60) $text = $item[INVIT_I_DESC];
            $text = invit_seo_trim($text, 140);
            // Общий текст серии или поставщика («Прямая поставка от поставщика…»)
            // одинаков у сотен товаров — описание тогда от названия и бренда
            $shared = (invit_seo_repeats()['desc'][trim($item[INVIT_I_DESC])] ?? 0) > 1;
            if ($shared || mb_strlen($text) < 60) {
                $name = rtrim($item[INVIT_I_TITLE], '. ');
                $brand = $item[INVIT_I_BRAND] !== '' && mb_stripos($name, $item[INVIT_I_BRAND]) === false ? ', ' . $item[INVIT_I_BRAND] : '';
                return invit_seo_trim($name . $brand . '. ' . INVIT_SEO_TERMS . ' ИНВИТ, Минск.', 160);
            }
            // Перечень характеристик поставщика («Основа: …, Объём: …») без названия
            // одинаков у похожих товаров — название впереди
            if (preg_match('/^[^.:]{2,40}:\s/u', $text)) {
                return invit_seo_trim(rtrim($item[INVIT_I_TITLE], '. ') . '. ' . $text, 160);
            }
            return mb_strlen($text) <= 140 ? $text . ' Цена по запросу.' : $text;
        case 'news':
            return 'Новости ООО «ИНВИТ»: сертификация продукции EUROBAND, переезды офиса и склада, изменения реквизитов и контактов.';
        case 'post':
            return invit_seo_trim(invit_news_excerpt($page['post'], 400), 158);
        case 'page':
            return invit_seo_pages()[$page['slug']]['desc'] ?? null;
    }
    return null;
}

function invit_seo_filter_title($title) {
    $page = invit_seo_page();
    if (!$page) return $title;
    $manual = invit_seo_manual($page, 'title');
    if ($manual !== '') return $manual;
    return invit_seo_title($page) ?? $title;
}
// После Yoast: его доработка для WooCommerce переписывает заголовок страницы магазина
add_filter('wpseo_title', 'invit_seo_filter_title', 20);
add_filter('wpseo_opengraph_title', 'invit_seo_filter_title', 20);

function invit_seo_filter_description($description) {
    $page = invit_seo_page();
    if (!$page) return $description;
    $manual = invit_seo_manual($page, 'metadesc');
    if ($manual !== '') return $manual;
    return invit_seo_description($page) ?? $description;
}
add_filter('wpseo_metadesc', 'invit_seo_filter_description', 20);
add_filter('wpseo_opengraph_desc', 'invit_seo_filter_description', 20);

/* Подраздел ?sub= — канонический адрес /catalog/<подраздел>/, как в карте сайта */
function invit_seo_canonical($canonical) {
    $page = invit_seo_page();
    if (!$page || $page['type'] !== 'sub' || !$page['term']) return $canonical;
    $link = get_term_link($page['term']);
    return is_wp_error($link) ? $canonical : $link;
}
add_filter('wpseo_canonical', 'invit_seo_canonical', 20);
add_filter('wpseo_opengraph_url', 'invit_seo_canonical', 20);

/* Бренды и метки — не отдельные страницы (ведут в каталог), в карте сайта им не место */
function invit_seo_sitemap_taxonomies($exclude, $taxonomy) {
    return in_array($taxonomy, ['product_brand', 'product_tag'], true) ? true : $exclude;
}
add_filter('wpseo_sitemap_exclude_taxonomy', 'invit_seo_sitemap_taxonomies', 10, 2);
