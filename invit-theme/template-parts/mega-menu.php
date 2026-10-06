<?php
/**
 * Мега-меню каталога — перенос src/components/home-v2/MegaMenu.tsx.
 * Слева список разделов, справа колонки подразделов того, на который навели.
 * Само содержимое (mega-panel.php) подгружается при первом наведении.
 */

if (!defined('ABSPATH')) exit;

?>
<div class="hidden lg:block" data-mega>
    <?php /* Кнопка каталога — единственная в меню, что краснеет: клиент правкой
             от 05.10 отделил её от остальных пунктов, они синеют. */ ?>
    <button
        type="button"
        data-mega-toggle
        aria-expanded="false"
        aria-controls="mega-menu"
        class="inline-flex items-center gap-2 min-h-11 px-4 rounded-[4px] text-sm font-semibold text-white whitespace-nowrap cursor-pointer transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue bg-inv-blue hover:bg-inv-red"
    >
        <?php echo invit_icon('menu', 'w-4 h-4'); ?>
        Каталог товаров
        <span data-mega-chevron class="inline-flex transition-transform duration-[240ms] ease-[cubic-bezier(0.4,0,0.2,1)]"><?php echo invit_icon('chevron-down', 'w-4 h-4'); ?></span>
    </button>

    <?php /* Панель позиционируется относительно всей шапки, а не кнопки: иначе
             она упирается в правый край окна. */ ?>
    <div id="mega-menu" data-mega-panel hidden class="absolute left-0 right-0 top-full z-40 pt-3">
        <div class="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div data-mega-body></div>
        </div>
    </div>
</div>
