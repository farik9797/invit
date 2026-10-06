<?php
/**
 * Состояние страницы каталога (src/pages/CatalogPage.tsx): раздел, отбор из
 * адреса, вид выдачи, ссылки на соседние состояния. Отбор живёт в адресе,
 * поэтому ссылку с выбранным брендом можно переслать, а «назад» работает.
 */

if (!defined('ABSPATH')) exit;

/** Вид выдачи — привычка человека, а не свойство ссылки: хранится в cookie. */
function invit_catalog_view() {
    $view = sanitize_key($_COOKIE['invit_view'] ?? '');
    return in_array($view, ['dense', 'grid', 'list'], true) ? $view : 'grid';
}

/** В плотной плитке карточки мельче, поэтому и порция больше. */
function invit_catalog_page_size($view) {
    return ['dense' => 48, 'grid' => 24, 'list' => 40][$view];
}

/** Раздел и подраздел по текущему адресу WordPress. */
function invit_catalog_context() {
    $category = null;
    $sub_from_term = null;

    if (is_product_category()) {
        $term = get_queried_object();
        $slug = urldecode($term->slug);
        if (invit_section($slug)) {
            $category = $slug;
        } elseif (invit_section_of_sub($slug)) {
            // Адрес подраздела /catalog/<подраздел>/ — это раздел с отбором
            $category = invit_section_of_sub($slug);
            $sub_from_term = $slug;
        }
    }

    $filters = invit_catalog_filters($_GET);
    if (!$filters['sub'] && $sub_from_term) $filters['sub'] = $sub_from_term;

    return [$category, $filters];
}

/** Адрес каталога или раздела с отбором. */
function invit_catalog_link($category, array $filters) {
    $params = invit_catalog_params($filters);
    return $category ? invit_url_category($category, $params) : invit_url_catalog($params);
}

/** Тот же отбор с переключённым значением признака (бренд, страна, размер). */
function invit_catalog_toggle_link($category, array $filters, $facet, $value) {
    if ($facet === 'diameter' || $facet === 'length') {
        $filters['sizes'][$facet] = invit_toggle($filters['sizes'][$facet], $value);
    } else {
        $filters[$facet] = invit_toggle($filters[$facet], $value);
    }
    return invit_catalog_link($category, $filters);
}

/** Сколько условий отбора включено — число на кнопке «Фильтры». */
function invit_catalog_active_count(array $f) {
    return count($f['brands']) + count($f['countries']) + count($f['sizes']['diameter'])
        + count($f['sizes']['length']) + ($f['sub'] ? 1 : 0);
}

/** Пустой отбор: «Сбросить всё» снимает и запрос, и сортировку. */
function invit_catalog_empty_filters() {
    return ['sub' => null, 'query' => '', 'brands' => [], 'countries' => [], 'sizes' => ['diameter' => [], 'length' => []], 'sort' => 'default'];
}

/** Порция выдачи: плитка, плотная плитка или список. */
function invit_catalog_render_items(array $items, $view, $offset = 0) {
    invit_prime_images($items);
    $in_cart = invit_cart_product_ids();
    if ($view === 'list') {
        foreach ($items as $item) {
            get_template_part('template-parts/product-row', null, [
                'item' => $item,
                'in_cart' => in_array($item[INVIT_I_ID], $in_cart, true),
            ]);
        }
        return;
    }
    invit_product_cards($items, $view === 'dense', $in_cart, $offset);
}

/*
 * Поиск WordPress (/?s=…&post_type=product) и прежний адрес каталога ведут
 * туда же, куда React: /catalog/?q=….
 */
function invit_catalog_redirects() {
    // Отдельного оформления нет: реквизиты заполняются прямо в заявке
    if (function_exists('is_checkout') && is_checkout() && !is_wc_endpoint_url()) {
        wp_safe_redirect(wc_get_cart_url());
        exit;
    }
    if (is_search() && get_query_var('post_type') === 'product') {
        wp_safe_redirect(invit_url_catalog(['q' => get_search_query(false)]), 301);
        exit;
    }
}
add_action('template_redirect', 'invit_catalog_redirects', 5);

/*
 * Выдачу каталог собирает сам из индекса, поэтому основной запрос WordPress
 * на страницах каталога облегчаем: одна запись без подсчёта всех строк.
 */
function invit_catalog_light_query($query) {
    if (is_admin() || !$query->is_main_query()) return;
    if ($query->is_post_type_archive('product') || $query->is_tax('product_cat') || $query->is_tax('product_tag')) {
        $query->set('posts_per_page', 1);
        $query->set('no_found_rows', true);
        $query->set('fields', 'ids');
    }
}
add_action('pre_get_posts', 'invit_catalog_light_query');
