<?php
/**
 * Импорт каталога в WooCommerce из CSV, который делает scripts/export-woocommerce.py.
 *
 * Встроенный импортёр Woo работает через админку и на общем хостинге часто
 * отваливается по памяти, поэтому тот же CSV заливаем из командной строки:
 *
 *     wp eval-file scripts/wp-import-products.php files/woocommerce-export/invit-products-01.csv
 *     wp eval-file scripts/wp-import-products.php <файл> --no-images   # без снимков, быстрее
 *
 * Повторный запуск того же файла не плодит дубли: товар ищется по артикулу и
 * обновляется.
 */

if (!defined('WP_CLI') || !WP_CLI) {
    exit("Запускать только через wp eval-file\n");
}

$args = $args ?? [];
$path = $args[0] ?? '';
$skip_images = in_array('--no-images', $args, true);

if (!$path || !file_exists($path)) {
    WP_CLI::error('не найден CSV: ' . $path);
}

require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

/**
 * Категория по пути «Раздел > Подраздел»; создаёт недостающие уровни.
 *
 * Второй путь — те же разделы латинскими слагами: без него WordPress делает
 * адрес из русского названия, и ссылка превращается в нечитаемый набор
 * процентных кодов, не совпадающий с адресами нынешнего сайта.
 */
function invit_term_path($path, $slug_path = '') {
    $names = array_map('trim', explode('>', $path));
    $slugs = array_map('trim', explode('>', $slug_path));

    $parent = 0;
    $term_id = 0;

    foreach ($names as $i => $name) {
        if ($name === '') continue;
        $slug = $slugs[$i] ?? '';

        $existing = get_term_by('name', $name, 'product_cat');
        if ($existing && (int) $existing->parent === (int) $parent) {
            $term_id = (int) $existing->term_id;
            // Раздел мог быть заведён раньше с кириллическим адресом — чиним.
            if ($slug !== '' && $existing->slug !== $slug) {
                wp_update_term($term_id, 'product_cat', ['slug' => $slug]);
            }
        } else {
            $args = ['parent' => $parent];
            if ($slug !== '') $args['slug'] = $slug;

            $made = wp_insert_term($name, 'product_cat', $args);
            if (is_wp_error($made)) {
                // Имя уже занято на другом уровне — берём существующий термин.
                $term_id = $existing ? (int) $existing->term_id : 0;
                if (!$term_id) continue;
            } else {
                $term_id = (int) $made['term_id'];
            }
        }
        $parent = $term_id;
    }

    return $term_id;
}

/** Картинка по ссылке в медиатеку; одна и та же ссылка не качается дважды. */
function invit_attach_image($url, $post_id) {
    static $seen = [];
    if (isset($seen[$url])) return $seen[$url];
    $id = media_sideload_image($url, $post_id, null, 'id');
    if (is_wp_error($id)) return 0;
    $seen[$url] = (int) $id;
    return (int) $id;
}

$handle = fopen($path, 'r');
$columns = fgetcsv($handle);
// CSV пишется с BOM, иначе Excel ломает кириллицу: снимаем его с первой колонки.
if ($columns && isset($columns[0])) {
    $columns[0] = preg_replace('/^\xEF\xBB\xBF/', '', $columns[0]);
}

$created = 0;
$updated = 0;
$failed = 0;

while (($line = fgetcsv($handle)) !== false) {
    $row = array_combine($columns, $line);
    if (!$row || empty($row['Name'])) continue;

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
    if ($row['Regular price'] !== '') {
        $product->set_regular_price($row['Regular price']);
    }

    // Атрибуты: бренд и страна — глобальные, по ним работает отбор в каталоге.
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
        $failed++;
        continue;
    }
    if (!$id) {
        $failed++;
        continue;
    }

    $terms = [];
    // Запятая делит категории, но в названии («Клинья, заглушки») она
    // экранирована слэшем — как того требует формат Woo.
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

    if (!$skip_images && !empty($row['Images']) && !get_post_thumbnail_id($id)) {
        $image_id = invit_attach_image($row['Images'], $id);
        if ($image_id) set_post_thumbnail($id, $image_id);
    }

    $existing_id ? $updated++ : $created++;
    if ((($created + $updated) % 100) === 0) {
        WP_CLI::log('обработано: ' . ($created + $updated));
    }
}

fclose($handle);
WP_CLI::success("создано: {$created}, обновлено: {$updated}, пропущено: {$failed}");
