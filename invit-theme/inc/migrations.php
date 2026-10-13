<?php
/**
 * Разовые правки каталога по просьбам клиента. Каждая выполняется один раз
 * (замок — add_option), без консоли на хостинге: при первом запросе к сайту
 * после выкладки темы.
 */

if (!defined('ABSPATH')) exit;

/**
 * 06.10: бутилкаучуковая лента ЛБ разделена на два товара по ширине.
 * Прежний товар становится «15 мм» (адрес сохраняется), рядом заводится
 * «45 мм». Фото: у 15 мм — тонкая лента на сэндвич-панелях, у 45 мм —
 * рулоны широкой ленты (на старом сайте файл LB-45) и широкая лента в стыке.
 * Таблица размеров и иллюстрации описания делятся в data/product-splits.json.
 */
function invit_split_butyl_tape() {
    $key = 'invit_split_butyl_tape_v1';
    if (get_option($key) || !add_option($key, time(), '', false)) return;

    $id = wc_get_product_id_by_sku('lenta-butilkauchukovaja-euroband-lb');
    $old = $id ? wc_get_product($id) : null;
    if (!$old || wc_get_product_id_by_sku('lenta-butilkauchukovaja-euroband-lb-45')) return;

    // Снимки по имени файла: рулоны — главный, остальные — галерея
    $rolls = (int) $old->get_image_id();
    $thin = 0;
    $wide = 0;
    foreach ($old->get_gallery_image_ids() as $att) {
        $file = basename((string) get_attached_file($att));
        if (str_contains($file, 'dvuhstronn')) $thin = (int) $att;
        elseif (str_contains($file, 'butyl-tape-lb')) $wide = (int) $att;
    }

    $wide_tape = new WC_Product_Simple();
    $wide_tape->set_name('Бутилкаучуковая лента EUROBAND ЛБ 45 мм, двусторонняя');
    $wide_tape->set_slug('lenta-butilkauchukovaja-euroband-lb-45');
    $wide_tape->set_sku('lenta-butilkauchukovaja-euroband-lb-45');
    $wide_tape->set_status('publish');
    $wide_tape->set_catalog_visibility('visible');
    $wide_tape->set_stock_status('instock');
    $wide_tape->set_short_description($old->get_short_description());
    $wide_tape->set_description($old->get_description());
    $wide_tape->set_attributes($old->get_attributes());
    $wide_tape->set_category_ids($old->get_category_ids());
    $wide_tape->set_tag_ids($old->get_tag_ids());
    if ($old->get_regular_price() !== '') $wide_tape->set_regular_price($old->get_regular_price());
    if ($rolls) $wide_tape->set_image_id($rolls);
    if ($wide) $wide_tape->set_gallery_image_ids([$wide]);
    $wide_tape->update_meta_data('_invit_after', $old->get_id());
    $wide_tape->save();

    $old->set_name('Бутилкаучуковая лента EUROBAND ЛБ 15 мм, двусторонняя');
    if ($thin) $old->set_image_id($thin);
    $old->set_gallery_image_ids([]);
    $old->save();

    invit_catalog_flush();
}
add_action('init', 'invit_split_butyl_tape', 30);

/** Разделение уже выполнено без метки порядка — ставим её отдельно. */
function invit_split_butyl_tape_order() {
    $key = 'invit_split_butyl_tape_order_v1';
    if (get_option($key) || !add_option($key, time(), '', false)) return;
    $old = wc_get_product_id_by_sku('lenta-butilkauchukovaja-euroband-lb');
    $new = wc_get_product_id_by_sku('lenta-butilkauchukovaja-euroband-lb-45');
    if ($old && $new && !get_post_meta($new, '_invit_after', true)) {
        update_post_meta($new, '_invit_after', $old);
        invit_catalog_flush();
    }
}
add_action('init', 'invit_split_butyl_tape_order', 31);

/**
 * 08.10: в письме покупателю стояла штатная инструкция способа оплаты —
 * «Оплата наличными при доставке». Теперь — про счёт-фактуру, как в описании
 * способа (inc/setup.php ставит то же при первичной настройке).
 */
function invit_cod_instructions() {
    $key = 'invit_cod_instructions_v1';
    if (get_option($key) || !add_option($key, time(), '', false)) return;
    $cod = get_option('woocommerce_cod_settings', []);
    $cod = is_array($cod) ? $cod : [];
    $cod['instructions'] = 'Менеджер выставит счёт-фактуру и пришлёт его на указанную почту.';
    update_option('woocommerce_cod_settings', $cod);
}
add_action('init', 'invit_cod_instructions', 32);

/**
 * 09.10: бренд из характеристики «Бренд» — в штатные «Бренды» WooCommerce
 * (Товары → Бренды). Там их видно списком, у товара бренд ставится галочкой,
 * каталог и фильтр берут его оттуда (invit_catalog_build). Характеристика
 * остаётся в товаре, но на сайт больше не влияет. «без товарного знака» —
 * не бренд, не переносится. Связи пишутся одним запросом на 500 товаров:
 * через wp_set_object_terms 8 тыс. товаров не уложились бы в запрос.
 */
function invit_brands_from_attribute() {
    $key = 'invit_brands_v1';
    if (!taxonomy_exists('product_brand') || get_option($key) || !add_option($key, time(), '', false)) return;
    global $wpdb;

    $rows = $wpdb->get_results(
        "SELECT m.post_id, m.meta_value FROM {$wpdb->postmeta} m
         JOIN {$wpdb->posts} p ON p.ID = m.post_id
         WHERE p.post_type = 'product' AND m.meta_key = '_product_attributes'",
        ARRAY_N
    );
    $by_brand = [];
    foreach ($rows as [$id, $value]) {
        $attrs = maybe_unserialize($value);
        if (!is_array($attrs)) continue;
        foreach ($attrs as $attr) {
            $brand = trim((string) ($attr['value'] ?? ''));
            if (($attr['name'] ?? '') !== 'Бренд' || $brand === '' || $brand === 'без товарного знака') continue;
            $by_brand[$brand][] = (int) $id;
        }
    }

    $tt_ids = [];
    foreach ($by_brand as $brand => $ids) {
        $term = term_exists($brand, 'product_brand')
            ?: wp_insert_term($brand, 'product_brand', ['slug' => sanitize_title(invit_fold($brand))]);
        if (is_wp_error($term)) continue;
        $tt = (int) $term['term_taxonomy_id'];
        $tt_ids[] = $tt;
        foreach (array_chunk($ids, 500) as $chunk) {
            $values = implode(',', array_map(static fn($id) => $wpdb->prepare('(%d, %d)', $id, $tt), $chunk));
            $wpdb->query("INSERT IGNORE INTO {$wpdb->term_relationships} (object_id, term_taxonomy_id) VALUES $values");
        }
    }
    wp_update_term_count_now($tt_ids, 'product_brand');
    clean_taxonomy_cache('product_brand');
    invit_catalog_flush();
}
add_action('init', 'invit_brands_from_attribute', 33);

/**
 * 09.10: подробное описание товара — в «Описание» WooCommerce, чтобы всё
 * правилось в админке. Раньше ниже первого абзаца шли блоки из site.json
 * (перенос со старого invit.by), и в админке их видно не было. Теперь в записи:
 * абзацы как были, линия «Далее» (<!--more-->), затем заголовки, списки,
 * таблицы, иллюстрации и «Также … доступны» — single-product.php выводит текст
 * до линии вверху у фото, после — ниже. Прежний текст — в мете
 * _invit_description_before (откат).
 */
function invit_full_descriptions() {
    $key = 'invit_full_descriptions_v1';
    if (get_option($key) || !add_option($key, time(), '', false)) return;
    global $wpdb;

    foreach (invit_catalog_index()['items'] as $item) {
        $id = $item[INVIT_I_ID];
        $content = invit_product_content($item[INVIT_I_SLUG]);
        if (!$content) continue;

        $before = (string) get_post_field('post_content', $id);
        if (str_contains($before, '<!--more-->')) continue;
        $paragraphs = array_filter(array_map(
            static fn($p) => trim(html_entity_decode(wp_strip_all_tags($p), ENT_QUOTES, 'UTF-8')),
            preg_split('/<\/p>\s*/', $before)
        ));
        $description = $paragraphs ? implode("\n", $paragraphs) : $item[INVIT_I_DESC];
        $blocks = invit_dedupe_content_blocks($content['blocks'] ?? [], $description, invit_product_also($item[INVIT_I_SLUG]));
        if (!$blocks) continue;

        update_post_meta($id, '_invit_description_before', wp_slash($before));
        $wpdb->update($wpdb->posts, [
            'post_content' => trim($before) . "\n\n<!--more-->\n\n" . invit_blocks_to_html($blocks),
        ], ['ID' => $id]);
        clean_post_cache($id);
    }
}
add_action('init', 'invit_full_descriptions', 34);

/** Блоки описания из site.json — в HTML для редактора WordPress. */
function invit_blocks_to_html(array $blocks) {
    $html = [];
    $gallery = [];
    $flush = static function () use (&$gallery, &$html) {
        if (!$gallery) return;
        $html[] = count($gallery) > 1
            ? '<div class="invit-gallery">' . implode('', $gallery) . '</div>'
            : $gallery[0];
        $gallery = [];
    };
    foreach ($blocks as $b) {
        if ($b['kind'] === 'image') {
            $title = (string) ($b['title'] ?? '');
            $gallery[] = '<figure><img src="' . esc_url(invit_content_image($b['src'])) . '" alt="' . esc_attr($title) . '">'
                . ($title !== '' ? '<figcaption>' . esc_html($title) . '</figcaption>' : '') . '</figure>';
            continue;
        }
        $flush();
        if ($b['kind'] === 'heading') {
            $html[] = '<h2>' . esc_html($b['text']) . '</h2>';
        } elseif ($b['kind'] === 'text') {
            $html[] = '<p>' . esc_html($b['text']) . '</p>';
        } elseif ($b['kind'] === 'list') {
            $html[] = '<ul>' . implode('', array_map(static fn($li) => '<li>' . esc_html($li) . '</li>', $b['items'])) . '</ul>';
        } elseif ($b['kind'] === 'links') {
            $html[] = '<ul>' . implode('', array_map(static fn($l) => '<li>' . ($l['href'] !== ''
                ? '<a href="' . esc_url($l['href']) . '">' . esc_html($l['label']) . '</a>'
                : esc_html($l['label'])) . '</li>', $b['items'])) . '</ul>';
        } elseif ($b['kind'] === 'table') {
            $head = $b['headers'] ? '<thead><tr>' . implode('', array_map(static fn($h) => '<th>' . esc_html($h) . '</th>', $b['headers'])) . '</tr></thead>' : '';
            $rows = implode('', array_map(static fn($r) => '<tr>' . implode('', array_map(static fn($c) => '<td>' . esc_html($c) . '</td>', $r)) . '</tr>', $b['rows']));
            $html[] = '<table>' . $head . '<tbody>' . $rows . '</tbody></table>';
        }
    }
    $flush();
    return implode("\n\n", $html);
}
