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
