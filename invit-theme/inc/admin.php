<?php
/**
 * Админка: правило «С этим товаром часто покупают» у раздела каталога
 * (Товары -> Категории -> раздел). Отмеченные подразделы — откуда берутся
 * спутники для всех товаров раздела, по одному из каждого, до четырёх.
 * У отдельного товара своё поле WooCommerce «Кросс-продажи» важнее.
 */

if (!defined('ABSPATH')) exit;

function invit_admin_companions_field($term) {
    if (!invit_section($term->slug)) return;

    $chosen = invit_section_companions($term->slug);
    $custom = metadata_exists('term', $term->term_id, 'invit_companions');
    ?>
    <tr class="form-field">
        <th scope="row">С этим товаром часто покупают</th>
        <td>
            <?php wp_nonce_field('invit_companions', 'invit_companions_nonce'); ?>
            <input type="hidden" name="invit_companions_form" value="1">
            <p class="description" style="margin-bottom:10px">
                Из отмеченных подразделов на странице каждого товара этого раздела
                показывается по одной позиции, всего до четырёх: сначала свои ленты,
                потом со снимком. Ничего не отмечено — блока нет. У отдельного товара
                можно выбрать позиции вручную: «Данные товара» → «Связанные товары» →
                «Кросс-продажи».
                <?php echo $custom ? '' : '<br><strong>Сейчас действует правило темы.</strong>'; ?>
            </p>

            <div style="max-height:420px;overflow:auto;border:1px solid #c3c4c7;border-radius:4px;padding:8px 12px;background:#fff">
                <?php foreach (invit_sections() as $section) : ?>
                    <p style="margin:10px 0 4px;font-weight:600"><?php echo esc_html($section['name']); ?></p>
                    <?php foreach ($section['subcategories'] as $sub) : ?>
                        <label style="display:block;margin:2px 0 2px 12px">
                            <input type="checkbox" name="invit_companions[]" value="<?php echo esc_attr($sub['slug']); ?>" <?php checked(in_array($sub['slug'], $chosen, true)); ?>>
                            <?php echo esc_html($sub['name']); ?>
                        </label>
                    <?php endforeach; ?>
                <?php endforeach; ?>
            </div>

            <?php if ($custom) : ?>
                <label style="display:block;margin-top:10px">
                    <input type="checkbox" name="invit_companions_reset" value="1">
                    Вернуть правило темы
                </label>
            <?php endif; ?>
        </td>
    </tr>
    <?php
}
add_action('product_cat_edit_form_fields', 'invit_admin_companions_field');

function invit_admin_companions_save($term_id) {
    if (empty($_POST['invit_companions_form'])) return;
    if (!wp_verify_nonce($_POST['invit_companions_nonce'] ?? '', 'invit_companions')) return;
    if (!current_user_can('manage_product_terms')) return;

    if (!empty($_POST['invit_companions_reset'])) {
        delete_term_meta($term_id, 'invit_companions');
        return;
    }

    $known = [];
    foreach (invit_sections() as $section) {
        foreach ($section['subcategories'] as $sub) $known[] = $sub['slug'];
    }
    $chosen = array_values(array_intersect(
        array_map('sanitize_title', (array) wp_unslash($_POST['invit_companions'] ?? [])),
        $known
    ));
    update_term_meta($term_id, 'invit_companions', $chosen);
}
add_action('edited_product_cat', 'invit_admin_companions_save');

/* Товар: метка в углу снимка — «Хит продаж» или «Новинка» */
function invit_admin_badge_field() {
    $options = ['' => 'Без метки'];
    foreach (invit_badges() as $key => $badge) $options[$key] = $badge['label'];
    woocommerce_wp_select([
        'id' => '_invit_badge',
        'label' => 'Метка на фото',
        'options' => $options,
        'desc_tip' => true,
        'description' => 'Плашка в углу снимка товара в каталоге и в карточке.',
    ]);
}
add_action('woocommerce_product_options_general_product_data', 'invit_admin_badge_field');

function invit_admin_badge_save($product) {
    if (!isset($_POST['_invit_badge'])) return;
    $badge = sanitize_key(wp_unslash($_POST['_invit_badge']));
    if ($badge !== '' && !isset(invit_badges()[$badge])) $badge = '';
    if ($badge === '') $product->delete_meta_data('_invit_badge');
    else $product->update_meta_data('_invit_badge', $badge);
}
add_action('woocommerce_admin_process_product_object', 'invit_admin_badge_save');

/* Товары: колонка «Бренды товара» сортируется — по названию бренда, товары без бренда в конце */
function invit_admin_brand_sortable($columns) {
    $columns['taxonomy-product_brand'] = 'product_brand';
    return $columns;
}
add_filter('manage_edit-product_sortable_columns', 'invit_admin_brand_sortable');

function invit_admin_brand_orderby($clauses, $query) {
    if (!is_admin() || !$query->is_main_query() || $query->get('orderby') !== 'product_brand') return $clauses;
    global $wpdb;
    $clauses['join'] .= " LEFT JOIN (
        SELECT tr.object_id, MIN(t.name) AS name FROM {$wpdb->term_relationships} tr
        JOIN {$wpdb->term_taxonomy} tt ON tt.term_taxonomy_id = tr.term_taxonomy_id AND tt.taxonomy = 'product_brand'
        JOIN {$wpdb->terms} t ON t.term_id = tt.term_id
        GROUP BY tr.object_id
    ) invit_brand ON invit_brand.object_id = {$wpdb->posts}.ID";
    $order = strtoupper((string) $query->get('order')) === 'DESC' ? 'DESC' : 'ASC';
    $clauses['orderby'] = "invit_brand.name IS NULL, invit_brand.name {$order}, {$wpdb->posts}.post_title ASC";
    return $clauses;
}
add_filter('posts_clauses', 'invit_admin_brand_orderby', 10, 2);
