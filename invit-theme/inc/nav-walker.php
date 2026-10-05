<?php
/**
 * Меню шапки выводится плоским списком ссылок: вся сетка строится на flex,
 * обёртки <ul>/<li> только мешали бы выравниванию по колонкам.
 */

if (!defined('ABSPATH')) exit;

class Invit_Nav_Walker extends Walker_Nav_Menu {

    /** @var string классы, одинаковые для всех пунктов */
    private $link_class;

    public function __construct($link_class = '') {
        $this->link_class = $link_class;
    }

    public function start_lvl(&$output, $depth = 0, $args = null) {}

    public function end_lvl(&$output, $depth = 0, $args = null) {}

    public function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $current = in_array('current-menu-item', (array) $item->classes, true);

        $output .= sprintf(
            '<a href="%s" class="%s%s"%s>%s</a>',
            esc_url($item->url),
            esc_attr($this->link_class),
            $current ? ' font-semibold' : '',
            $current ? ' aria-current="page"' : '',
            esc_html($item->title)
        );
    }

    public function end_el(&$output, $item, $depth = 0, $args = null) {}
}
