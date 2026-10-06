<?php
/**
 * Новости: обложки, анонс и перенос шести заметок React-сайта в записи
 * WordPress — дальше их правят в админке, как обычные записи.
 */

if (!defined('ABSPATH')) exit;

/**
 * Обложка по теме заметки (src/lib/newsCovers.ts): настоящих фото к событиям
 * у клиента нет. Новой записи без своей картинки достаётся баннер ассортимента.
 */
function invit_news_cover($post) {
    if (has_post_thumbnail($post)) return get_the_post_thumbnail_url($post, 'large');

    $covers = [
        'sertifikat-invit-2025-2027' => 'news/sertifikat-invit-2025-2027.webp',
        'sertifikat-beltpp-2014' => 'news/sertifikat-beltpp-2014.webp',
        'rasshirenie-skladskoj-programmy' => 'news/skladskaya-programma.webp',
        'invit-pereezd-na-mkad' => 'news/vse-materialy-dlya-okon.webp',
        'invit-novye-nomera-telefonov' => 'news/izmenilsya-nomer-telefona.webp',
        'invit-novye-rekvizity-2017' => 'news/novye-rekvizity-iban.webp',
    ];
    $slug = get_post_field('post_name', $post);
    return invit_asset('img/' . ($covers[$slug] ?? 'banners/euroband-range-navy.webp'));
}

/** Где на обложке текст (скан, плакат) — кадр целиком, фото кадрируем. */
function invit_news_cover_fit($post) {
    if (has_post_thumbnail($post)) return 'object-cover';
    $slug = get_post_field('post_name', $post);
    $whole = str_starts_with($slug, 'sertifikat') || in_array($slug, ['invit-pereezd-na-mkad', 'invit-novye-nomera-telefonov'], true);
    return $whole ? 'object-contain p-3 bg-inv-surface-2' : 'object-cover';
}

/** Рубрика заметки: «Сертификация», «Компания», «Новости». */
function invit_news_category($post) {
    $cats = get_the_category($post);
    return $cats ? $cats[0]->name : 'Новости';
}

/** Анонс: первый абзац, до 250 знаков по границе слова (NewsGrid.tsx). */
function invit_news_excerpt($post, $limit = 250) {
    $text = trim(wp_strip_all_tags(preg_split('/<\/p>|\n/', get_post_field('post_content', $post))[0] ?? ''));
    $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
    if (mb_strlen($text) <= $limit) return $text;

    $cut = mb_substr($text, 0, $limit);
    $space = mb_strrpos($cut, ' ');
    $cut = mb_substr($cut, 0, ($space !== false && $space > $limit - 40) ? $space : $limit);
    return preg_replace('/[.,;:!?\s]+$/u', '', $cut) . '…';
}

/** «8 декабря 2025» -> дата записи. */
function invit_news_date($text) {
    $months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    if (!preg_match('/(\d{1,2})\s+(\S+)\s+(\d{4})/u', $text, $m)) return current_time('mysql');
    $month = array_search(mb_strtolower($m[2]), $months, true);
    return sprintf('%04d-%02d-%02d 10:00:00', $m[3], $month === false ? 1 : $month + 1, $m[1]);
}

/**
 * Разовый перенос заметок React-сайта. Адрес записи — тот же, что был на
 * invit.by (/sertifikat-invit-2025-2027/ и т. п.), поэтому старые ссылки живы.
 * add_option — замок: второй одновременный запрос перенос не повторит.
 */
function invit_seed_news() {
    if (get_option('invit_seed_news') || !add_option('invit_seed_news', time(), '', false)) return;

    foreach (array_reverse(invit_data('news')) as $news) {
        if (get_page_by_path($news['id'], OBJECT, 'post')) continue;

        $category = term_exists($news['category'], 'category');
        if (!$category) $category = wp_insert_term($news['category'], 'category');
        $category_id = is_array($category) ? (int) $category['term_id'] : 0;

        $paragraphs = array_filter(array_map('trim', explode("\n", $news['content'])));
        wp_insert_post([
            'post_type' => 'post',
            'post_status' => 'publish',
            'post_title' => $news['title'],
            'post_name' => $news['id'],
            'post_date' => invit_news_date($news['date']),
            'post_content' => implode("\n\n", array_map(static fn($p) => '<p>' . esc_html($p) . '</p>', $paragraphs)),
            'post_category' => $category_id ? [$category_id] : [],
        ]);
    }

    // Запись-заглушка из чистой установки на сайте не нужна
    $hello = get_page_by_path('privet-mir', OBJECT, 'post') ?: get_post(1);
    if ($hello && $hello->post_type === 'post' && in_array($hello->post_title, ['Привет, мир!', 'Hello world!'], true)) {
        wp_trash_post($hello->ID);
    }
}
add_action('init', 'invit_seed_news', 20);

/** Страница «Лучший строительный продукт года — 2013»: на неё ведёт медаль. */
function invit_seed_pages() {
    if (get_option('invit_seed_pages') || !add_option('invit_seed_pages', time(), '', false)) return;
    if (!get_page_by_path('bestsel')) {
        wp_insert_post([
            'post_type' => 'page',
            'post_status' => 'publish',
            'post_title' => 'Лучший строительный продукт года — 2013',
            'post_name' => 'bestsel',
        ]);
    }
}
add_action('init', 'invit_seed_pages', 20);
