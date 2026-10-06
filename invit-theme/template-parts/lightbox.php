<?php
/**
 * Просмотр фото во весь экран — src/components/Lightbox.tsx: стрелки, Esc,
 * клик по фону. Кадры берёт из data-gallery страницы товара.
 */

if (!defined('ABSPATH')) exit;
?>
<div data-lightbox hidden class="fixed inset-0 z-60 bg-ink/95 flex items-center justify-center p-4 sm:p-10" role="dialog" aria-modal="true">
    <button type="button" data-lightbox-close class="absolute top-4 right-4 p-2.5 rounded-[4px] text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" aria-label="Закрыть">
        <?php echo invit_icon('x', 'w-6 h-6'); ?>
    </button>
    <button type="button" data-lightbox-prev class="absolute left-3 sm:left-6 p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" aria-label="Предыдущее фото">
        <?php echo invit_icon('chevron-left', 'w-7 h-7'); ?>
    </button>
    <button type="button" data-lightbox-next class="absolute right-3 sm:right-6 p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" aria-label="Следующее фото">
        <?php echo invit_icon('chevron-right', 'w-7 h-7'); ?>
    </button>
    <img data-lightbox-image src="" alt="" class="w-auto h-auto max-w-[92vw] max-h-[85vh] object-contain bg-white rounded-lg">
    <span data-lightbox-count class="absolute bottom-5 text-xs text-white/60"></span>
</div>
