<?php
/**
 * Адреса каталога — такие же, как на прежнем сайте: /catalog/<раздел>/<товар>.
 *
 * WooCommerce с базой «/catalog/%product_cat%» подставляет в ссылку весь путь
 * категории, то есть и подраздел: /catalog/materialy-dlya-okon/montazhnye-lenty…/товар.
 * Старые ссылки были короче — раздел и товар, поэтому путь схлопываем до
 * верхнего раздела. Разбор адреса это не ломает: правило перезаписи Woo ловит
 * любую глубину до имени товара.
 */

if (!defined('ABSPATH')) exit;

/** Верхний раздел товара: тот, у которого нет родителя. */
function invit_top_category($product_id) {
    $terms = get_the_terms($product_id, 'product_cat');
    if (!$terms || is_wp_error($terms)) return null;

    foreach ($terms as $term) {
        if ((int) $term->parent === 0) return $term;
    }

    // Товар лежит только в подразделе — поднимаемся к его корню.
    $term = reset($terms);
    while ($term && (int) $term->parent !== 0) {
        $parent = get_term((int) $term->parent, 'product_cat');
        if (!$parent || is_wp_error($parent)) break;
        $term = $parent;
    }

    return $term;
}

function invit_product_permalink($permalink, $post) {
    if (!$post || $post->post_type !== 'product' || strpos($permalink, '/catalog/') === false) {
        return $permalink;
    }

    $top = invit_top_category($post->ID);
    if (!$top) return $permalink;

    return home_url(user_trailingslashit('catalog/' . $top->slug . '/' . $post->post_name));
}
add_filter('post_type_link', 'invit_product_permalink', 20, 2);

/**
 * Раздел и подраздел живут по короткому адресу /catalog/<слаг>/.
 *
 * По умолчанию Woo вкладывает подраздел в раздел, и адрес подраздела из трёх
 * частей не отличить от адреса товара: правило товара ловит его первым. Слаги
 * у нас уникальные, поэтому держим один уровень — как и на прежнем сайте, где
 * подраздел был параметром, а не частью пути.
 */
function invit_category_permalink($link, $term, $taxonomy) {
    if ($taxonomy !== 'product_cat') return $link;

    return home_url(user_trailingslashit('catalog/' . $term->slug));
}
add_filter('term_link', 'invit_category_permalink', 20, 3);

/**
 * Своё правило для короткого адреса раздела: товар остаётся двухсегментным.
 *
 * Правила добавляем фильтром итогового набора, а не add_rewrite_rule: при
 * совпадении базы магазина и базы разделов WooCommerce пересобирает набор
 * по-своему, и добавленное правило до сохранения не доживало.
 */
function invit_category_rewrite($rules) {
    $mine = [
        'catalog/([^/]+)/?$' => 'index.php?product_cat=$matches[1]',
        'catalog/([^/]+)/page/([0-9]{1,})/?$' => 'index.php?product_cat=$matches[1]&paged=$matches[2]',
    ];

    // Товар — два сегмента, его правила Woo идут раньше и срабатывают первыми.
    return array_merge($mine, $rules);
}
add_filter('rewrite_rules_array', 'invit_category_rewrite', 99);

/**
 * Короткий адрес товара — конечный, без перенаправления.
 *
 * WordPress сам приводит адрес к «правильному» виду, а правильным он считает
 * полный путь категории с подразделом: получалась петля из 301 на тот же
 * короткий адрес, который отдаёт наш фильтр ссылок.
 */
function invit_keep_product_url($redirect) {
    return is_singular('product') ? false : $redirect;
}
add_filter('redirect_canonical', 'invit_keep_product_url');

/**
 * Снимаем и собственное перенаправление WooCommerce: оно уводит карточку на
 * адрес с полным путём категории, а наш фильтр ссылок возвращает короткий —
 * запрос ходил по кругу и отдавал 301 сам на себя.
 */
function invit_drop_wc_canonical() {
    // Woo вешает своё перенаправление на приоритет 5 — снимаем ровно его.
    remove_action('template_redirect', 'wc_product_canonical_redirect', 5);
}
add_action('wp_loaded', 'invit_drop_wc_canonical');
