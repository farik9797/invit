<?php
/**
 * Каталог как на React-сайте: тот же отбор, поиск, порядок и счётчики.
 *
 * React держит все 8740 товаров в браузере и фильтрует их на лету. Тема делает
 * то же самое на сервере: товары один раз собираются в компактный индекс
 * (файл в uploads, его подхватывает opcache), а логика отбора перенесена из
 * src/lib/catalogFilters.ts, search.ts, productSize.ts и product.ts построчно.
 * Правите логику там — правьте и здесь, иначе выдача двух сайтов разойдётся.
 */

if (!defined('ABSPATH')) exit;

/* Поля записи индекса: упакованный массив вместо словаря — втрое меньше памяти. */
const INVIT_I_ID = 0;
const INVIT_I_TITLE = 1;
const INVIT_I_SLUG = 2;
const INVIT_I_CAT = 3;
const INVIT_I_SUB = 4;
const INVIT_I_ALSO_CAT = 5;
const INVIT_I_ALSO_SUB = 6;
const INVIT_I_BRAND = 7;
const INVIT_I_COUNTRY = 8;
const INVIT_I_SKU = 9;
const INVIT_I_DESC = 10;
const INVIT_I_THUMB = 11;
const INVIT_I_OWN = 12;
const INVIT_I_FTITLE = 13;
const INVIT_I_FSKU = 14;
const INVIT_I_INSTOCK = 15;
const INVIT_I_BADGE = 16;

const INVIT_OWN_BRAND = 'EUROBAND';
const INVIT_INDEX_VERSION = 6;

/* ------------------------------------------------------------------ индекс */

function invit_catalog_cache_file() {
    $dir = wp_upload_dir(null, false)['basedir'] . '/invit-cache';
    // Новая выгрузка данных темы (site.json) — новый индекс: в нём разделы и прописки
    $data = get_template_directory() . '/data/site.json';
    $stamp = file_exists($data) ? filemtime($data) : 0;
    return $dir . '/catalog-v' . INVIT_INDEX_VERSION . '-' . $stamp . '.php';
}

/** Сбросить индекс: товар сохранили в админке или прошёл импорт. */
function invit_catalog_flush() {
    $file = invit_catalog_cache_file();
    if (file_exists($file)) @unlink($file);
}
add_action('save_post_product', 'invit_catalog_flush');
add_action('deleted_post', 'invit_catalog_flush');
add_action('set_object_terms', 'invit_catalog_flush');
add_action('woocommerce_update_product', 'invit_catalog_flush');
add_action('woocommerce_product_set_stock_status', 'invit_catalog_flush');

/** Артикул из «Артикул» поставщика; служебный (равный адресу товара) не показываем. */
function invit_real_sku($sku, $slug) {
    $norm = static function ($s) {
        return trim(strtolower(preg_replace('/[^a-z0-9]+/i', '-', $s)), '-');
    };
    return ($sku === '' || $norm($sku) === $norm($slug)) ? '' : $sku;
}

function invit_catalog_build() {
    global $wpdb;

    $posts = $wpdb->get_results(
        "SELECT ID, post_title, post_name, post_excerpt FROM {$wpdb->posts}
         WHERE post_type = 'product' AND post_status = 'publish' ORDER BY ID ASC",
        ARRAY_N
    );

    $meta = [];
    $rows = $wpdb->get_results(
        "SELECT m.post_id, m.meta_key, m.meta_value FROM {$wpdb->postmeta} m
         JOIN {$wpdb->posts} p ON p.ID = m.post_id
         WHERE p.post_type = 'product' AND m.meta_key IN ('_sku', '_thumbnail_id', '_product_attributes', '_invit_after', '_stock_status', '_invit_badge')",
        ARRAY_N
    );
    foreach ($rows as [$id, $key, $value]) $meta[$id][$key] = $value;

    $terms = [];
    $rows = $wpdb->get_results(
        "SELECT tr.object_id, tt.taxonomy, t.slug, t.name FROM {$wpdb->term_relationships} tr
         JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
         JOIN {$wpdb->terms} t ON t.term_id = tt.term_id
         WHERE tt.taxonomy IN ('product_cat', 'product_tag')",
        ARRAY_N
    );
    foreach ($rows as [$id, $tax, $slug, $name]) {
        $terms[$id][$tax][] = $tax === 'product_tag' ? $name : urldecode($slug);
    }

    $also = invit_data('alsoSub');
    $items = [];
    $sub_photo = [];
    $cat_photo = [];
    $by_slug = [];

    foreach ($posts as [$id, $title, $slug, $excerpt]) {
        $subs = array_values(array_filter(
            $terms[$id]['product_cat'] ?? [],
            static fn($s) => invit_section_of_sub($s) !== ''
        ));
        if (!$subs) continue;

        // Вторая прописка: подраздел «в гостях» знает React-выгрузка
        $also_sub = $also[$slug] ?? '';
        $main = array_values(array_diff($subs, [$also_sub]))[0] ?? $subs[0];
        if (!in_array($also_sub, $subs, true)) $also_sub = '';
        // Подраздел-«гость» в другом разделе: товар числится и там
        $also_cat = $also_sub ? invit_section_of_sub($also_sub) : (invit_shared_subs()[$main][0] ?? '');

        $brand = '';
        $country = '';
        $attrs = maybe_unserialize($meta[$id]['_product_attributes'] ?? '');
        if (is_array($attrs)) {
            foreach ($attrs as $attr) {
                if (($attr['name'] ?? '') === 'Бренд') $brand = (string) $attr['value'];
                if (($attr['name'] ?? '') === 'Страна') $country = (string) $attr['value'];
            }
        }

        $sku = invit_real_sku((string) ($meta[$id]['_sku'] ?? ''), $slug);
        $thumb = (int) ($meta[$id]['_thumbnail_id'] ?? 0);
        $own = in_array('Собственное производство', $terms[$id]['product_tag'] ?? [], true) ? 1 : 0;
        $desc = trim(wp_strip_all_tags($excerpt));
        if (mb_strlen($desc) > 320) $desc = mb_substr($desc, 0, 320);

        $item = [
            (int) $id,
            $title,
            $slug,
            invit_section_of_sub($main),
            $main,
            $also_cat,
            $also_sub,
            $brand,
            $country,
            $sku,
            $desc,
            $thumb,
            $own,
            invit_fold($title),
            invit_fold($sku),
            // «Нет в наличии» в админке прячет товар из каталога, поиска и меню
            ($meta[$id]['_stock_status'] ?? 'instock') === 'outofstock' ? 0 : 1,
            (string) ($meta[$id]['_invit_badge'] ?? ''),
        ];
        $items[] = $item;
        $by_slug[$slug] = count($items) - 1;

        // Знак раздела — снимок первого товара со снимком (sectionPhotos.tsx)
        if ($thumb) {
            foreach ([[$main, $item[INVIT_I_CAT]], [$also_sub, $item[INVIT_I_ALSO_CAT]]] as [$s, $c]) {
                if ($s && !isset($sub_photo[$s])) $sub_photo[$s] = $thumb;
                if ($c && !isset($cat_photo[$c])) $cat_photo[$c] = $thumb;
            }
        }
    }

    // Товар, отделённый от другого (ЛБ 45 мм от ЛБ 15 мм), стоит сразу за ним,
    // а не в конце каталога, куда его поставил бы новый номер записи
    $moved = [];
    foreach ($items as $i => $item) {
        $after = (int) ($meta[$item[INVIT_I_ID]]['_invit_after'] ?? 0);
        if ($after) $moved[$after][] = $item;
    }
    if ($moved) {
        $ordered = [];
        foreach ($items as $item) {
            if (!empty($meta[$item[INVIT_I_ID]]['_invit_after'])) continue;
            $ordered[] = $item;
            foreach ($moved[$item[INVIT_I_ID]] ?? [] as $follower) $ordered[] = $follower;
        }
        $items = $ordered;
        $by_slug = [];
        foreach ($items as $i => $item) $by_slug[$item[INVIT_I_SLUG]] = $i;
    }

    // Ручной выбор там, где первый товар представляет раздел плохо
    $picked = [
        'krovelnye-uplotniteli-kleykie-lenty' => 'lenta-butilkauchukovaja-euroband-lb',
        'tapes' => 'psul-euroband-dlja-okon',
    ];
    foreach ($picked as $section => $product_slug) {
        $index = $by_slug[$product_slug] ?? null;
        if ($index === null || !$items[$index][INVIT_I_THUMB]) continue;
        if (isset($cat_photo[$section])) $cat_photo[$section] = $items[$index][INVIT_I_THUMB];
        else $sub_photo[$section] = $items[$index][INVIT_I_THUMB];
    }

    $url = static fn($att) => (string) wp_get_attachment_image_url($att, 'full');

    return [
        'items' => $items,
        'bySlug' => $by_slug,
        'subPhoto' => array_map($url, $sub_photo),
        'catPhoto' => array_map($url, $cat_photo),
    ];
}

/** Индекс каталога: из файла-кэша, при его отсутствии — сборка и запись. */
function invit_catalog_index() {
    static $index = null;
    if ($index !== null) return $index;

    $file = invit_catalog_cache_file();
    if (is_readable($file)) {
        $index = include $file;
        if (is_array($index)) return $index;
    }

    $index = invit_catalog_build();
    wp_mkdir_p(dirname($file));
    $tmp = $file . '.' . getmypid() . '.tmp';
    if (@file_put_contents($tmp, '<?php return ' . var_export($index, true) . ';') !== false) {
        @rename($tmp, $file);
    }
    return $index;
}

/** Товары витрины: все, кроме отмеченных в админке «Нет в наличии». */
function invit_catalog_items() {
    static $items = null;
    if ($items === null) {
        $items = array_values(array_filter(invit_catalog_index()['items'], static fn($i) => $i[INVIT_I_INSTOCK]));
    }
    return $items;
}

/** Запись индекса по ID товара WordPress. */
function invit_catalog_item_by_id($id) {
    static $by_id = null;
    if ($by_id === null) {
        $by_id = [];
        // По всем товарам: позиция без наличия могла остаться в чьей-то заявке
        foreach (invit_catalog_index()['items'] as $i => $item) $by_id[$item[INVIT_I_ID]] = $i;
    }
    $i = $by_id[(int) $id] ?? null;
    return $i === null ? null : invit_catalog_index()['items'][$i];
}

/* ------------------------------------------------------------ счётчики */

/** COUNT_CATEGORY, COUNT_SUB, OWN_COUNT из src/lib/catalogCounts.ts. */
function invit_catalog_counts() {
    static $counts = null;
    if ($counts !== null) return $counts;

    $counts = ['cat' => [], 'sub' => [], 'own' => 0, 'all' => 0];
    foreach (invit_catalog_items() as $item) {
        $counts['all']++;
        foreach ([INVIT_I_CAT, INVIT_I_SUB, INVIT_I_ALSO_CAT, INVIT_I_ALSO_SUB] as $field) {
            $slug = $item[$field];
            if ($slug === '') continue;
            $bucket = ($field === INVIT_I_CAT || $field === INVIT_I_ALSO_CAT) ? 'cat' : 'sub';
            $counts[$bucket][$slug] = ($counts[$bucket][$slug] ?? 0) + 1;
        }
        if ($item[INVIT_I_BRAND] === INVIT_OWN_BRAND) $counts['own']++;
    }
    return $counts;
}

/* ---------------------------------------------------------- знаки разделов */

/** Снимки разделов от клиента (sectionPhotos.tsx, CLIENT). */
function invit_client_section_photos() {
    return [
        'materialy-dlya-okon', 'pena-montazhnaya', 'germetiki', 'kley-himiya-smazki',
        'uplotnitelnye-lenty-pes-samokleyaschiesy', 'krovelnye-uplotniteli-kleykie-lenty',
        'uplotnitel-rezinovyy-d-p-e', 'krepezh', 'alyuminievye-armirovannye-lenty', 'ventilyaciya',
        'instrument-oborudovanie', 'siz-rashodnye-materialy', 'osnastka-k-elektroinstrumentu',
    ];
}

/** Снимок раздела или подраздела; пустая строка, если снимка нет. */
function invit_section_photo($slug) {
    if ($slug === 'tapes') return invit_asset('img/section-photos/tapes.webp');
    if (in_array($slug, invit_client_section_photos(), true)) {
        return invit_asset("img/section-photos/{$slug}.webp");
    }
    $index = invit_catalog_index();
    return $index['subPhoto'][$slug] ?? $index['catPhoto'][$slug] ?? '';
}

/** Путь знака раздела (sectionIcons.tsx): нарисован формулами, не руками. */
function invit_section_icon_path($slug) {
    static $alias = [
        'krepezh-homuty' => 'homuty',
        'dyubel-metallicheskiy-pustotelyy' => 'dyubel-raspornyy',
        'pena-montazhnaya' => 'pena-montazhnaya-ochistitel-dlya-peny',
        'pena-montazhnaya-ppu' => 'pena-montazhnaya-ochistitel-dlya-peny',
        'ochistiteli-peny' => 'pena-montazhnaya-ochistitel-dlya-peny',
        'kley-pena' => 'klei-montazhnye',
        'germetiki-specializirovannye' => 'germetiki',
        'klei-bytovye' => 'klei-montazhnye',
        'shina-montazhnaya' => 'profil-montazhnyy-l-u',
    ];
    $icons = invit_data('drawnIcons');
    if (isset($icons[$slug])) return [$slug, $icons[$slug]];
    $other = $alias[$slug] ?? '';
    if ($other !== '' && isset($icons[$other])) return [$other, $icons[$other]];
    return ['all', $icons['all'] ?? ''];
}

/*
 * Знаки на странице повторяются десятками (по два в каждой карточке), а путь
 * у знака — до трёх килобайт. Поэтому в разметке ссылка <use>, а сами пути
 * один раз в спрайте внизу страницы (invit_icon_sprite). В ответах на запросы
 * скриптов (подсказка поиска, «Показать ещё», меню) спрайта нет — там путь
 * пишется прямо в знак.
 */
function invit_icon_registry($add = null) {
    static $used = [];
    if ($add !== null) $used[$add[0]] = $add[1];
    return $used;
}

function invit_icons_inline() {
    return (defined('WC_DOING_AJAX') && WC_DOING_AJAX) || isset($_GET['invit_more']);
}

/** Линейный знак раздела. */
function invit_section_icon($slug, $size = 24, $class = 'w-5 h-5') {
    [$key, $path] = invit_section_icon_path($slug);
    $open = sprintf(
        '<svg viewBox="0 0 384 384" width="%1$d" height="%1$d" class="%2$s" fill="none" stroke="currentColor" '
        . 'stroke-width="18" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">',
        (int) $size,
        esc_attr($class)
    );
    if (invit_icons_inline()) return $open . '<path d="' . esc_attr($path) . '"/></svg>';

    invit_icon_registry([$key, $path]);
    return $open . '<use href="#si-' . esc_attr($key) . '"/></svg>';
}

/** Спрайт знаков, использованных на странице (footer.php). */
function invit_icon_sprite() {
    $used = invit_icon_registry();
    if (!$used) return;
    echo '<svg xmlns="http://www.w3.org/2000/svg" data-icon-sprite style="display:none">';
    foreach ($used as $key => $path) {
        echo '<symbol id="si-' . esc_attr($key) . '" viewBox="0 0 384 384"><path d="' . esc_attr($path) . '"/></symbol>';
    }
    echo '</svg>';
}

/** SectionMark: снимок раздела, а без снимка — линейный знак. */
function invit_section_mark($slug, $size, $class = '', $fill = false) {
    $photo = invit_section_photo($slug);
    if ($photo === '') return invit_section_icon($slug, $size, $class);

    return sprintf(
        '<img src="%s" alt=""%s loading="lazy" class="%s">',
        esc_url($photo),
        $fill ? '' : sprintf(' width="%1$d" height="%1$d"', (int) $size),
        esc_attr(trim($class . ' object-contain' . ($fill ? ' w-full h-full' : '')))
    );
}

/* ------------------------------------------------------------------ поиск */

/** fold() из search.ts: одно написание для запроса и для названия. */
function invit_fold($text) {
    static $cyr = [
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
        'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's',
        'т' => 't', 'у' => 'u', 'ф' => 'f', 'ц' => 'c', 'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y',
        'ь' => '', 'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
    ];
    $text = mb_strtolower((string) $text, 'UTF-8');
    $text = str_replace('ё', 'е', $text);
    $text = str_replace(',', '.', $text);
    $text = str_replace(['х', 'x'], 'x', $text);
    $text = strtr($text, $cyr);
    $text = preg_replace('/ks\b/', 'x', $text);
    $text = preg_replace('/\s+/u', ' ', $text);
    return trim($text);
}

function invit_search_alias($term) {
    static $alias = [
        'bosh' => 'bosch', 'evroband' => 'euroband', 'miksfor' => 'mixfor', 'kosmofen' => 'cosmofen',
        'kosmo' => 'cosmo', 'dzheta' => 'jeta', 'arktik' => 'arctic', 'xauzer' => 'hauser', 'zum' => 'zoom',
        'sudal' => 'soudal', 'abrafors' => 'abraforce', 'lugaabraziv' => 'lugaabrasiv', 'daymond' => 'diamond',
    ];
    return isset($alias[$term]) ? [$term, $alias[$term]] : [$term];
}

/** Забыли переключить раскладку: «uthvtnbr» -> «герметик» и обратно. */
function invit_swap_layout($text) {
    static $layout = [
        'q' => 'й', 'w' => 'ц', 'e' => 'у', 'r' => 'к', 't' => 'е', 'y' => 'н', 'u' => 'г', 'i' => 'ш', 'o' => 'щ',
        'p' => 'з', '[' => 'х', ']' => 'ъ', 'a' => 'ф', 's' => 'ы', 'd' => 'в', 'f' => 'а', 'g' => 'п',
        'h' => 'р', 'j' => 'о', 'k' => 'л', 'l' => 'д', ';' => 'ж', "'" => 'э', 'z' => 'я', 'x' => 'ч',
        'c' => 'с', 'v' => 'м', 'b' => 'и', 'n' => 'т', 'm' => 'ь', ',' => 'б', '.' => 'ю', '/' => '.',
    ];
    static $back = null;
    if ($back === null) $back = array_flip($layout);

    $out = '';
    foreach (mb_str_split(mb_strtolower($text, 'UTF-8')) as $ch) {
        $out .= $layout[$ch] ?? $back[$ch] ?? $ch;
    }
    return $out;
}

/** Слова раздела и подраздела: запрос «уголки» показывает весь подраздел. */
function invit_section_words($slug) {
    static $words = null;
    if ($words === null) {
        $words = [];
        $split = static fn($text) => array_values(array_filter(preg_split('/[^a-z0-9]+/', invit_fold($text))));
        foreach (invit_sections() as $section) {
            $words[$section['slug']] = $split($section['name']);
            foreach ($section['subcategories'] as $sub) {
                $words[$sub['slug']] ??= $split($section['name'] . ' ' . $sub['name']);
            }
        }
    }
    return $words[$slug] ?? null;
}

function invit_same_word($word, $term) {
    if ($word === $term) return true;
    $min = min(strlen($word), strlen($term));
    if ($min < 4 || abs(strlen($word) - strlen($term)) > 2) return false;
    $head = $min >= 6 ? $min - 2 : $min - 1;
    return substr($word, 0, $head) === substr($term, 0, $head);
}

function invit_in_section(array $item, $term) {
    $words = invit_section_words($item[INVIT_I_SUB]) ?? invit_section_words($item[INVIT_I_CAT]);
    if (!$words) return false;
    foreach ($words as $word) {
        if (invit_same_word($word, $term)) return true;
    }
    return false;
}

function invit_at_word_start($hay, $term) {
    return str_starts_with($hay, $term) || str_contains($hay, ' ' . $term) || str_contains($hay, '-' . $term);
}

function invit_in_sku($sku, $term) {
    if ($sku === '') return false;
    $code = strlen($term) >= 4 && preg_match('/\d/', $term) && preg_match('/[a-z-]/', $term);
    if ($code) return str_contains($sku, $term);
    return preg_match('/^\d{5,}$/', $term) && in_array($term, explode('-', $sku), true);
}

/** Вес совпадения: артикул > начало слов > вхождение > раздел (search.ts). */
function invit_search_score(array $item, $query, array $terms) {
    $title = $item[INVIT_I_FTITLE];
    $sku = $item[INVIT_I_FSKU];

    if ($sku !== '' && $sku === $query) return 5;
    if (invit_in_sku($sku, $query)) return 4;

    $found = true;
    foreach ($terms as $term) {
        $hit = false;
        foreach (invit_search_alias($term) as $v) {
            if (str_contains($title, $v) || invit_in_sku($sku, $v)) { $hit = true; break; }
        }
        if (!$hit) { $found = false; break; }
    }

    if (!$found) {
        foreach ($terms as $term) {
            $hit = false;
            foreach (invit_search_alias($term) as $v) {
                if (invit_in_section($item, $v)) { $hit = true; break; }
            }
            if (!$hit) return 0;
        }
        return 0.5;
    }

    $heads = 0;
    foreach ($terms as $term) {
        foreach (invit_search_alias($term) as $v) {
            if (invit_at_word_start($title, $v)) { $heads++; break; }
        }
    }
    if ($heads === count($terms)) return 3;
    return str_contains($title, $query) ? 2 : 1;
}

function invit_search_run(array $items, $needle) {
    $terms = array_values(array_filter(explode(' ', $needle), 'strlen'));
    $scored = [];
    foreach ($items as $item) {
        $score = invit_search_score($item, $needle, $terms);
        if ($score > 0) $scored[] = [$score, $item];
    }
    // usort в PHP 8 устойчив: при равном весе сохраняется порядок каталога
    usort($scored, static fn($a, $b) => $b[0] <=> $a[0]);
    return array_column($scored, 1);
}

/** searchProducts(): пустой запрос — список как есть. */
function invit_search(array $items, $query) {
    $needle = invit_fold($query);
    if ($needle === '') return $items;

    $found = invit_search_run($items, $needle);
    if ($found) return $found;

    $swapped = invit_fold(invit_swap_layout($query));
    return ($swapped !== '' && $swapped !== $needle) ? invit_search_run($items, $swapped) : [];
}

/* ------------------------------------------------------------- размеры */

/** Какие размеры показывать в разделе (productSize.ts, SECTION_SIZES). */
function invit_section_sizes($category) {
    $sizes = [
        'krepezh' => ['diameter', 'length'],
        'osnastka-k-elektroinstrumentu' => ['diameter'],
    ];
    return $sizes[$category] ?? [];
}

function invit_size_label($axis) {
    return $axis === 'diameter' ? 'Диаметр, мм' : 'Длина, мм';
}

/** «Диаметр 3.2 мм» для плашки выбранного значения. */
function invit_size_chip($axis, $value) {
    return preg_replace('/,.*$/', '', invit_size_label($axis)) . ' ' . $value . ' мм';
}

/** Размер из названия: «Анкер-шуруп 6.0х35 мм» -> 6 и 35. */
function invit_product_size(array $item) {
    static $cache = [];
    $id = $item[INVIT_I_ID];
    if (isset($cache[$id])) return $cache[$id];

    $num = static function ($raw) {
        $value = (float) str_replace(',', '.', $raw);
        return (string) $value;
    };
    if (preg_match('/(\d+(?:[.,]\d+)?)\s*[хx]\s*(\d+(?:[.,]\d+)?)/u', $item[INVIT_I_TITLE], $m)) {
        return $cache[$id] = ['diameter' => $num($m[1]), 'length' => $num($m[2])];
    }
    return $cache[$id] = ['diameter' => '', 'length' => ''];
}

/* -------------------------------------------------------- отбор и порядок */

function invit_in_category(array $item, $slug) {
    return $item[INVIT_I_CAT] === $slug || $item[INVIT_I_ALSO_CAT] === $slug;
}

function invit_in_sub(array $item, $slug) {
    return $item[INVIT_I_SUB] === $slug || $item[INVIT_I_ALSO_SUB] === $slug;
}

/** Своё производство первым, следом позиции со снимком (sortForListing). */
function invit_sort_for_listing(array $items) {
    $weight = static fn($i) => ($i[INVIT_I_OWN] ? 0 : 2) + ($i[INVIT_I_THUMB] ? 0 : 1);
    usort($items, static fn($a, $b) => $weight($a) <=> $weight($b));
    return $items;
}

function invit_sort_labels() {
    return ['default' => 'Сортировать по', 'name' => 'Название: А → Я', 'name-desc' => 'Название: Я → А'];
}

function invit_compare_titles($a, $b) {
    static $collator = null;
    if ($collator === null) {
        $collator = class_exists('Collator') ? new Collator('ru_RU') : false;
        if ($collator) $collator->setAttribute(Collator::NUMERIC_COLLATION, Collator::ON);
    }
    return $collator ? $collator->compare($a, $b) : strnatcasecmp($a, $b);
}

/** Отбор из адреса страницы: те же параметры, что у React (readFilters). */
function invit_catalog_filters(array $params) {
    $many = static function ($key) use ($params) {
        $raw = isset($params[$key]) ? (string) wp_unslash($params[$key]) : '';
        return array_values(array_filter(array_map('trim', explode(',', $raw)), 'strlen'));
    };
    $sort = isset($params['sort']) ? sanitize_key($params['sort']) : 'default';

    return [
        'sub' => isset($params['sub']) && $params['sub'] !== '' ? sanitize_title(wp_unslash($params['sub'])) : null,
        'query' => isset($params['q']) ? trim(sanitize_text_field(wp_unslash($params['q']))) : '',
        'brands' => $many('brand'),
        'countries' => $many('country'),
        'sizes' => ['diameter' => $many('d'), 'length' => $many('l')],
        'sort' => array_key_exists($sort, invit_sort_labels()) ? $sort : 'default',
    ];
}

/** Обратно в параметры адреса (writeFilters). */
function invit_catalog_params(array $f) {
    $params = [];
    if ($f['sub']) $params['sub'] = $f['sub'];
    if (trim($f['query']) !== '') $params['q'] = trim($f['query']);
    if ($f['brands']) $params['brand'] = implode(',', $f['brands']);
    if ($f['countries']) $params['country'] = implode(',', $f['countries']);
    if ($f['sizes']['diameter']) $params['d'] = implode(',', $f['sizes']['diameter']);
    if ($f['sizes']['length']) $params['l'] = implode(',', $f['sizes']['length']);
    if ($f['sort'] !== 'default') $params['sort'] = $f['sort'];
    return $params;
}

function invit_catalog_is_filtered(array $f) {
    return (bool) ($f['sub'] || $f['query'] !== '' || $f['brands'] || $f['countries']
        || $f['sizes']['diameter'] || $f['sizes']['length']);
}

/** Значение в списке включено — убрать, нет — добавить (toggle). */
function invit_toggle(array $list, $value) {
    return in_array($value, $list, true)
        ? array_values(array_diff($list, [$value]))
        : array_merge($list, [$value]);
}

/** Значения признака со счётчиками, по убыванию частоты (countBy). */
function invit_count_by(array $items, $field) {
    $counts = [];
    foreach ($items as $item) {
        $value = $item[$field];
        if ($value !== '') $counts[$value] = ($counts[$value] ?? 0) + 1;
    }
    $pairs = [];
    foreach ($counts as $value => $n) $pairs[] = [(string) $value, $n];
    usort($pairs, static fn($a, $b) => ($b[1] <=> $a[1]) ?: invit_compare_titles($a[0], $b[0]));
    return $pairs;
}

/** selectProducts() из catalogFilters.ts. */
function invit_catalog_select($category, array $f) {
    $base = invit_catalog_items();
    if ($category) $base = array_values(array_filter($base, static fn($i) => invit_in_category($i, $category)));
    if ($f['sub']) $base = array_values(array_filter($base, static fn($i) => invit_in_sub($i, $f['sub'])));
    $base = invit_search($base, $f['query']);

    $by_brand = static fn($i) => !$f['brands'] || in_array($i[INVIT_I_BRAND], $f['brands'], true);
    $by_country = static fn($i) => !$f['countries'] || in_array($i[INVIT_I_COUNTRY], $f['countries'], true);

    // Размеры только внутри раздела: 125 мм круга и 3.5 мм самореза не уживаются
    $axes = $category ? invit_section_sizes($category) : [];
    $by_axis = static function ($axis) use ($f) {
        return static function ($i) use ($axis, $f) {
            $chosen = $f['sizes'][$axis];
            return !$chosen || in_array(invit_product_size($i)[$axis], $chosen, true);
        };
    };
    $by_all_sizes = static function ($i) use ($axes, $by_axis) {
        foreach ($axes as $axis) {
            if (!$by_axis($axis)($i)) return false;
        }
        return true;
    };

    $products = array_values(array_filter($base, static fn($i) => $by_brand($i) && $by_country($i) && $by_all_sizes($i)));

    if ($f['sort'] === 'default') {
        $products = invit_sort_for_listing($products);
    } else {
        $dir = $f['sort'] === 'name' ? 1 : -1;
        usort($products, static fn($a, $b) => $dir * invit_compare_titles($a[INVIT_I_TITLE], $b[INVIT_I_TITLE]));
    }

    $sizes = [];
    foreach ($axes as $axis) {
        $pool = array_filter($base, static function ($i) use ($axes, $axis, $by_axis, $by_brand, $by_country) {
            if (!$by_brand($i) || !$by_country($i)) return false;
            foreach ($axes as $other) {
                if ($other !== $axis && !$by_axis($other)($i)) return false;
            }
            return true;
        });
        $counts = [];
        foreach ($pool as $i) {
            $value = invit_product_size($i)[$axis];
            if ($value !== '') $counts[$value] = ($counts[$value] ?? 0) + 1;
        }
        $options = [];
        foreach ($counts as $value => $n) $options[] = [(string) $value, $n];
        usort($options, static fn($a, $b) => (float) $a[0] <=> (float) $b[0]);
        $sizes[] = ['axis' => $axis, 'options' => $options];
    }

    return [
        'products' => $products,
        'brands' => invit_count_by(array_filter($base, static fn($i) => $by_country($i) && $by_all_sizes($i)), INVIT_I_BRAND),
        'countries' => invit_count_by(array_filter($base, static fn($i) => $by_brand($i) && $by_all_sizes($i)), INVIT_I_COUNTRY),
        'sizes' => $sizes,
        'scope' => count($base),
    ];
}

/* ------------------------------------------------- соседи и спутники товара */

/** «Другие позиции раздела»: подраздел, потом остальной раздел (ProductPage). */
function invit_related(array $item, $limit = 4) {
    $siblings = [];
    $nearby = [];
    foreach (invit_catalog_items() as $other) {
        if ($other[INVIT_I_ID] === $item[INVIT_I_ID]) continue;
        if ($other[INVIT_I_SUB] === $item[INVIT_I_SUB]) $siblings[] = $other;
        elseif ($other[INVIT_I_CAT] === $item[INVIT_I_CAT]) $nearby[] = $other;
    }
    return array_slice(array_merge(invit_sort_for_listing($siblings), invit_sort_for_listing($nearby)), 0, $limit);
}

/**
 * Правило «С этим товаром часто покупают» по умолчанию (src/lib/crossSell.ts):
 * к разделу — подразделы, без которых работу не сделать. Пена добавлена
 * 06.10, в React для неё правила не было.
 */
function invit_default_companions() {
    return [
        'materialy-dlya-okon' => ['pistolety-dlya-peny', 'germetiki-silikonovye', 'samorez-okonnyy-ostryy', 'himiya-dlya-okon-cosmofen'],
        'pena-montazhnaya' => ['pistolety-dlya-peny', 'ochistiteli-peny', 'germetiki-silikonovye', 'perchatki'],
        'germetiki' => ['pistolety-dlya-germetika', 'himiya-dlya-okon-cosmofen', 'malyarnaya-lenta', 'perchatki'],
        'kley-himiya-smazki' => ['pistolety-dlya-germetika', 'malyarnaya-lenta', 'perchatki'],
        'uplotnitelnye-lenty-pes-samokleyaschiesy' => ['samorez-krovelnyy', 'germetiki-silikonovye', 'instrument-rezhuschiy'],
        'krovelnye-uplotniteli-kleykie-lenty' => ['samorez-krovelnyy', 'germetiki-silikonovye', 'alyuminievye-lenty-alu'],
        'uplotnitel-rezinovyy-d-p-e' => ['himiya-dlya-okon-cosmofen', 'smazki-aerozolnye', 'instrument-rezhuschiy'],
        'krepezh' => ['osnastka-dlya-dreley-shurupovertov', 'sverlenie', 'instrument-krepyozhnyy', 'perchatki'],
        'alyuminievye-armirovannye-lenty' => ['izolyacionnye-lenty', 'instrument-rezhuschiy', 'perchatki'],
        'ventilyaciya' => ['alyuminievye-lenty-alu', 'dyubel-raspornyy', 'shpilka-rezbovaya', 'instrument-krepyozhnyy'],
        'instrument-oborudovanie' => ['osnastka-dlya-dreley-shurupovertov', 'ochki', 'perchatki'],
        'siz-rashodnye-materialy' => ['perchatki', 'ochki', 'maski', 'plyonka-ukryvochnaya'],
        'osnastka-k-elektroinstrumentu' => ['ochki', 'perchatki', 'maski', 'naushniki'],
    ];
}

/**
 * Подразделы-спутники раздела: заданные в админке (Товары -> Категории ->
 * раздел -> «С этим товаром часто покупают»), иначе правило темы. Пустой
 * список из админки — осознанное «не показывать».
 */
function invit_section_companions($section) {
    $term = get_term_by('slug', $section, 'product_cat');
    if ($term && metadata_exists('term', $term->term_id, 'invit_companions')) {
        return array_values((array) get_term_meta($term->term_id, 'invit_companions', true));
    }
    return invit_default_companions()[$section] ?? [];
}

/** «С этим товаром часто покупают» — подбор по правилу раздела. */
function invit_cross_sell(array $item, $limit = 4) {
    $groups = array_values(array_filter(
        invit_section_companions($item[INVIT_I_CAT]),
        static fn($slug) => $slug !== $item[INVIT_I_SUB]
    ));
    if (!$groups) return [];

    // Внутри подраздела: сначала наши, потом со снимком (цены на витрине нет)
    $weight = static fn($i) => ($i[INVIT_I_OWN] ? 0 : 4) + ($i[INVIT_I_THUMB] ? 0 : 2) + 1;
    $pools = [];
    foreach ($groups as $slug) {
        $pool = array_values(array_filter(
            invit_catalog_items(),
            static fn($i) => $i[INVIT_I_SUB] === $slug && $i[INVIT_I_ID] !== $item[INVIT_I_ID]
        ));
        usort($pool, static fn($a, $b) => $weight($a) <=> $weight($b));
        $pools[] = $pool;
    }

    $out = [];
    for ($round = 0; count($out) < $limit; $round++) {
        $before = count($out);
        foreach ($pools as $pool) {
            if (count($out) >= $limit) break;
            if (isset($pool[$round])) $out[] = $pool[$round];
        }
        if (count($out) === $before) break;
    }
    return $out;
}

/* ------------------------------------------------------------- для карточек */

function invit_item_url(array $item) {
    return home_url('/catalog/' . $item[INVIT_I_CAT] . '/' . $item[INVIT_I_SLUG] . '/');
}

/** Снимок товара в полном размере: исходники 500px, как на React-сайте. */
function invit_item_image(array $item) {
    return $item[INVIT_I_THUMB] ? (string) wp_get_attachment_image_url($item[INVIT_I_THUMB], 'full') : '';
}

/** Подгрузить снимки разом, а не по запросу на каждую карточку. */
function invit_prime_images(array $items) {
    $ids = array_filter(array_map(static fn($i) => $i[INVIT_I_THUMB], $items));
    if ($ids) _prime_post_caches(array_values($ids), false, true);
}

/** Единица счёта (unit.ts): крепёж в коробах, ленты рулонами. */
function invit_item_unit(array $item) {
    if (preg_match('/\((\d+)\s*шт\.?\s*в\s+(?:коробе|упаковке|уп\.?)\)/iu', $item[INVIT_I_TITLE], $m)) {
        return ['short' => 'упак.', 'hint' => 'по ' . $m[1] . ' шт'];
    }
    if (in_array($item[INVIT_I_SUB], invit_data('tapeSubcategories'), true)) {
        return ['short' => 'рул.', 'hint' => ''];
    }
    return ['short' => 'шт.', 'hint' => ''];
}

/** ID товаров, уже лежащих в заявке. */
function invit_cart_product_ids() {
    if (!function_exists('WC') || !WC()->cart) return [];
    $ids = [];
    foreach (WC()->cart->get_cart() as $line) $ids[] = (int) $line['product_id'];
    return $ids;
}

/* ------------------------------------------------------------- мега-меню */

/**
 * Разделы для мобильного меню (MOBILE_CATALOG_LINKS): только подписи и адреса.
 * Без индекса товаров — его загрузка на страницах без каталога лишняя.
 */
function invit_menu_links() {
    $links = [['label' => 'Ленты EUROBAND', 'href' => invit_url_catalog(['brand' => INVIT_OWN_BRAND])]];
    foreach (invit_sections() as $section) {
        $links[] = ['label' => $section['name'], 'href' => invit_url_category($section['slug'])];
    }
    return $links;
}

/** Заголовок для карточки: длинные названия поставщика режем по слову. */
function invit_short_title($title, $limit = 70) {
    if (mb_strlen($title) <= $limit) return $title;
    return preg_replace('/\s+\S*$/u', '', mb_substr($title, 0, $limit)) . '...';
}

/**
 * Разделы мега-меню (home-v2/MegaMenu.tsx): «Ленты EUROBAND» сборной первой
 * строкой, затем разделы каталога; в подразделе до пяти товаров, свои первыми.
 */
function invit_mega_sections() {
    static $sections = null;
    if ($sections !== null) return $sections;

    $by_sub = [];
    foreach (invit_catalog_items() as $item) {
        $by_sub[$item[INVIT_I_SUB]][] = $item;
        if ($item[INVIT_I_ALSO_SUB] !== '') $by_sub[$item[INVIT_I_ALSO_SUB]][] = $item;
    }

    $group = static function ($sub_slug, $name, $section = '') use ($by_sub) {
        $items = $by_sub[$sub_slug] ?? [];
        usort($items, static fn($a, $b) => ($a[INVIT_I_OWN] ? 0 : 1) <=> ($b[INVIT_I_OWN] ? 0 : 1));
        return [
            'name' => $name,
            'slug' => $sub_slug,
            'href' => $section ? invit_url_category($section, ['sub' => $sub_slug]) : invit_url_sub($sub_slug),
            'items' => array_map(static fn($i) => [
                'title' => invit_short_title($i[INVIT_I_TITLE]),
                'href' => invit_item_url($i),
            ], array_slice($items, 0, 5)),
        ];
    };

    $tapes = [];
    foreach (invit_data('tapeSubcategories') as $slug) {
        // Подраздел без товаров пропускаем, как в React
        if (!empty($by_sub[$slug])) $tapes[] = $group($slug, invit_sub_name($slug));
    }

    $sections = [[
        'id' => 'tapes',
        'label' => 'Ленты EUROBAND',
        'href' => invit_url_catalog(['brand' => INVIT_OWN_BRAND]),
        'groups' => $tapes,
    ]];
    foreach (invit_sections() as $section) {
        $sections[] = [
            'id' => $section['slug'],
            'label' => $section['name'],
            'href' => invit_url_category($section['slug']),
            'groups' => array_map(static fn($sub) => $group($sub['slug'], $sub['name'], $section['slug']), $section['subcategories']),
        ];
    }
    return $sections;
}

/* ------------------------------------------------------- сетка карточек */

/**
 * ProductGrid из ProductCard.tsx: классы колонок перечислены целиком —
 * Tailwind не собирает имена по частям.
 */
function invit_product_grid(array $items, $columns = 4, $dense = false) {
    if (!$items) {
        echo '<div class="py-16 text-center text-sm text-inv-ink-muted bg-inv-surface-1 rounded-[8px] border border-inv-border">'
            . 'В этом разделе пока нет позиций. Напишите нам, подберём аналог под ваш проект.</div>';
        return;
    }

    $grids = [
        3 => 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch',
        4 => 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch',
        5 => 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch',
        6 => 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 items-stretch',
    ];
    $class = $dense ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch' : $grids[$columns];

    invit_prime_images($items);
    $in_cart = invit_cart_product_ids();

    echo '<div class="' . esc_attr($class) . '" data-grid>';
    invit_product_cards($items, $dense || $columns >= 5, $in_cart);
    echo '</div>';
}

/** Карточки без обёртки сетки — их же дописывает «Показать ещё». */
function invit_product_cards(array $items, $compact, array $in_cart, $offset = 0) {
    foreach ($items as $idx => $item) {
        $delay = min(($idx + $offset) * 0.04, 0.24);
        echo '<div data-reveal data-delay="' . esc_attr($offset ? 0 : $delay) . '" class="h-full">';
        get_template_part('template-parts/product-card', null, [
            'item' => $item,
            'compact' => $compact,
            'in_cart' => in_array($item[INVIT_I_ID], $in_cart, true),
        ]);
        echo '</div>';
    }
}

/* --------------------------------------------- подробное описание товара */

/**
 * dedupeContentBlocks() из src/lib/product.ts: убирает абзац, повторяющий
 * краткое описание, и перечни бывших ссылок «…доступны:».
 */
function invit_dedupe_content_blocks(array $blocks, $description) {
    $norm = static fn($s) => mb_strtolower(trim(preg_replace('/\s+/u', ' ', (string) $s)));
    $target = $norm($description);
    $cross = static fn($text) => (bool) preg_match('/доступны\s*:?\s*$/iu', (string) $text);

    $is_duplicate = static function ($b) use ($target, $norm) {
        if ($target === '' || $b['kind'] !== 'text') return false;
        $text = $norm($b['text']);
        if ($text === '') return true;
        return $text === $target
            || str_starts_with($text, mb_substr($target, 0, 80))
            || str_starts_with($target, mb_substr($text, 0, 80));
    };

    $kept = [];
    foreach ($blocks as $idx => $b) {
        if ($is_duplicate($b)) continue;
        if ($b['kind'] === 'heading' && $cross($b['text'] ?? '')) continue;
        $prev = $blocks[$idx - 1] ?? null;
        if ($b['kind'] === 'list' && $prev && $prev['kind'] === 'heading' && $cross($prev['text'] ?? '')) continue;
        $kept[] = $b;
    }

    // Заголовок без содержимого до следующего заголовка больше не нужен
    $out = [];
    foreach ($kept as $idx => $b) {
        if ($b['kind'] === 'heading') {
            $next = $kept[$idx + 1] ?? null;
            if (!$next || $next['kind'] === 'heading') continue;
        }
        $out[] = $b;
    }
    return $out;
}

/** Локальная копия иллюстрации со старого invit.by (contentImages.ts). */
function invit_content_image($remote) {
    $file = invit_data('contentImageMap')[$remote] ?? '';
    return $file !== '' ? invit_asset('img/content/' . $file . '.webp') : $remote;
}

/**
 * Подробное описание товара с учётом разделения одного товара на несколько
 * (data/product-splits.json): описание берётся у исходного, а в таблице
 * размеров и иллюстрациях остаётся только своё.
 */
function invit_product_content($slug) {
    static $splits = null;
    if ($splits === null) {
        $file = get_template_directory() . '/data/product-splits.json';
        $splits = is_readable($file) ? (array) json_decode(file_get_contents($file), true) : [];
    }
    $split = $splits[$slug] ?? null;
    $content = invit_data('productContent')[$split['from'] ?? $slug] ?? null;
    if (!$split || !$content) return $content;

    $blocks = [];
    foreach ($content['blocks'] as $block) {
        if ($block['kind'] === 'table') {
            $rows = array_values(array_filter($block['rows'], static fn($r) => str_starts_with($r[0], $split['row'])));
            if ($rows) $blocks[] = ['rows' => $rows] + $block;
            continue;
        }
        if ($block['kind'] === 'image') {
            $keep = false;
            foreach ($split['images'] as $name) {
                if (str_contains($block['src'], $name)) $keep = true;
            }
            if (!$keep) continue;
        }
        $blocks[] = $block;
    }
    $content['blocks'] = $blocks;
    return $content;
}

/**
 * Спутники, выбранные вручную у товара: «Данные товара» -> «Связанные
 * товары» -> «Кросс-продажи». Порядок — как в админке, не больше восьми.
 */
function invit_manual_cross_sells(WC_Product $product) {
    $items = [];
    foreach ($product->get_cross_sell_ids() as $id) {
        $item = invit_catalog_item_by_id($id);
        if ($item && $item[INVIT_I_ID] !== $product->get_id()) $items[] = $item;
    }
    return array_slice($items, 0, 8);
}

/* ------------------------------------------------- метка на фото товара */

/** Метки, которые можно поставить товару в админке (поле «Метка на фото»). */
function invit_badges() {
    return [
        'hit' => ['label' => 'Хит продаж', 'class' => 'bg-inv-red text-white'],
        'new' => ['label' => 'Новинка', 'class' => 'bg-inv-success text-white'],
    ];
}

/** Плашка метки; положение задаёт $class. Пусто, если метки нет. */
function invit_badge_html($badge, $class = '') {
    $badges = invit_badges();
    if (!isset($badges[$badge])) return '';
    return sprintf(
        '<span class="pointer-events-none inline-flex items-center rounded-[4px] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] leading-none shadow-[0_2px_8px_rgba(22,44,88,0.18)] %s %s">%s</span>',
        esc_attr($badges[$badge]['class']),
        esc_attr($class),
        esc_html($badges[$badge]['label'])
    );
}
