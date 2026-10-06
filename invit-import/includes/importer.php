<?php
/**
 * Разбор одной строки выгрузки каталога (scripts/export-woocommerce.py) в товар
 * WooCommerce. Общая часть для импорта из админки (плагин) и из командной
 * строки (scripts/wp-import-products.php) — чтобы логика жила в одном месте.
 */

if (!defined('ABSPATH')) exit;

if (!function_exists('invit_term_path')) {
    /**
     * Категория по пути «Раздел > Подраздел»; создаёт недостающие уровни.
     *
     * Второй путь — те же разделы латинскими слагами: без него WordPress делает
     * адрес из русского названия, и ссылка превращается в нечитаемый набор
     * процентных кодов, не совпадающий с адресами прежнего сайта.
     */
    function invit_term_path($path, $slug_path = '') {
        $names = array_map('trim', explode('>', $path));
        $slugs = array_map('trim', explode('>', $slug_path));

        $parent = 0;
        $term_id = 0;

        foreach ($names as $i => $name) {
            if ($name === '') continue;
            $slug = $slugs[$i] ?? '';

            // Ищем по адресу: он уникален. По имени нельзя — «Хомуты» есть и в
            // «Крепеже», и в «Вентиляции», и поиск по имени уводил хомуты
            // вентиляции в крепёж (14 из 15).
            $term = $slug !== '' ? get_term_by('slug', $slug, 'product_cat') : null;

            if (!$term) {
                // Адреса нет — имя ищем только среди детей нужного родителя.
                $found = get_terms([
                    'taxonomy'   => 'product_cat',
                    'name'       => $name,
                    'parent'     => $parent,
                    'hide_empty' => false,
                    'number'     => 1,
                ]);
                $term = ($found && !is_wp_error($found)) ? $found[0] : null;
            }

            if ($term) {
                $term_id = (int) $term->term_id;
                $fix = [];
                if ($slug !== '' && $term->slug !== $slug) $fix['slug'] = $slug;
                if ((int) $term->parent !== (int) $parent) $fix['parent'] = $parent;
                if ($fix) wp_update_term($term_id, 'product_cat', $fix);
            } else {
                $args = ['parent' => $parent];
                if ($slug !== '') $args['slug'] = $slug;

                $made = wp_insert_term($name, 'product_cat', $args);
                if (is_wp_error($made)) {
                    // Термин уже есть — WordPress сообщает его номер в ошибке.
                    $term_id = (int) ($made->get_error_data('term_exists') ?: 0);
                    if (!$term_id) continue;
                } else {
                    $term_id = (int) $made['term_id'];
                }
            }
            $parent = $term_id;
        }

        return $term_id;
    }
}

if (!function_exists('invit_attach_image')) {
    /** Картинка по ссылке в медиатеку; одна и та же ссылка не качается дважды. */
    function invit_attach_image($url, $post_id) {
        static $seen = [];
        if (isset($seen[$url])) return $seen[$url];

        require_once ABSPATH . 'wp-admin/includes/media.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';

        $id = media_sideload_image($url, $post_id, null, 'id');
        if (is_wp_error($id)) return 0;

        $seen[$url] = (int) $id;
        return (int) $id;
    }
}

if (!function_exists('invit_import_row')) {
    /**
     * Создаёт или обновляет товар по строке CSV.
     *
     * @return string 'created' | 'updated' | 'failed'
     */
    function invit_import_row(array $row, $with_image = true) {
        if (empty($row['Name'])) return 'failed';

        $sku = trim((string) $row['SKU']);
        $existing_id = $sku ? wc_get_product_id_by_sku($sku) : 0;

        $product = $existing_id ? wc_get_product($existing_id) : new WC_Product_Simple();
        $product->set_name($row['Name']);
        if (!empty($row['Slug'])) {
            $product->set_slug(sanitize_title($row['Slug']));
        }
        $product->set_status('publish');
        $product->set_catalog_visibility('visible');
        $product->set_short_description((string) $row['Short description']);
        $product->set_description((string) $row['Description']);
        $product->set_stock_status('instock');
        if ($sku && !$existing_id) {
            $product->set_sku($sku);
        }
        if (($row['Regular price'] ?? '') !== '') {
            $product->set_regular_price($row['Regular price']);
        }

        // Атрибуты: бренд и страна — по ним работает отбор в каталоге.
        $attributes = [];
        foreach ([1, 2] as $n) {
            $name = trim((string) ($row["Attribute {$n} name"] ?? ''));
            $value = trim((string) ($row["Attribute {$n} value(s)"] ?? ''));
            if ($name === '' || $value === '') continue;
            $attribute = new WC_Product_Attribute();
            $attribute->set_name($name);
            $attribute->set_options([$value]);
            $attribute->set_visible(true);
            $attributes[] = $attribute;
        }
        $product->set_attributes($attributes);

        try {
            $id = $product->save();
        } catch (Exception $e) {
            return 'failed';
        }
        if (!$id) return 'failed';

        // Запятая делит категории, но в названии («Клинья, заглушки») она
        // экранирована слэшем — как того требует формат Woo.
        $terms = [];
        $paths = preg_split('/(?<!\\\\),/', (string) $row['Categories']);
        $slug_paths = array_map('trim', explode(',', (string) ($row['Category slugs'] ?? '')));

        foreach ($paths as $i => $path_name) {
            $path_name = trim(str_replace('\\,', ',', $path_name));
            if ($path_name === '') continue;
            $term_id = invit_term_path($path_name, $slug_paths[$i] ?? '');
            if ($term_id) $terms[] = $term_id;
        }
        if ($terms) {
            wp_set_object_terms($id, $terms, 'product_cat');
        }

        if (!empty($row['Tags'])) {
            wp_set_object_terms($id, array_map('trim', explode(',', $row['Tags'])), 'product_tag');
        }

        if ($with_image && !empty($row['Images']) && !get_post_thumbnail_id($id)) {
            $image_id = invit_attach_image($row['Images'], $id);
            if ($image_id) set_post_thumbnail($id, $image_id);
        }

        return $existing_id ? 'updated' : 'created';
    }
}

if (!function_exists('invit_import_image_row')) {
    /**
     * Только снимок для уже заведённого товара.
     *
     * @return string 'attached' | 'skipped' | 'failed'
     */
    function invit_import_image_row(array $row) {
        $sku = trim((string) ($row['SKU'] ?? ''));
        if ($sku === '' || empty($row['Images'])) return 'skipped';

        $id = wc_get_product_id_by_sku($sku);
        if (!$id || get_post_thumbnail_id($id)) return 'skipped';

        $image_id = invit_attach_image($row['Images'], $id);
        if (!$image_id) return 'failed';

        set_post_thumbnail($id, $image_id);
        return 'attached';
    }
}
