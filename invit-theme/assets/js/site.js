/*
 * Поведение шапки и первого экрана. Без зависимостей: на статическом сайте
 * хватает своих обработчиков, библиотека анимаций тут ничего не ускорит.
 */
(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* ---- Шапка: уезжает при прокрутке вниз, возвращается при прокрутке вверх ---- */
    var header = $('[data-header]');
    if (header) {
        var lastY = 0;
        header.style.transition = 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms';
        window.addEventListener('scroll', function () {
            var y = Math.max(window.scrollY, 0);
            header.style.boxShadow = y > 8 ? '0 6px 24px rgb(15 37 55 / 0.10)' : '';

            var step = y - lastY;
            if (Math.abs(step) < 6) return;
            lastY = y;

            var busy = header.querySelector('[aria-expanded="true"]');
            header.style.transform = (!busy && step > 0 && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
        }, { passive: true });
    }

    /* ---- Меню каталога ---- */
    var mega = $('[data-mega]');
    if (mega) {
        var megaToggle = $('[data-mega-toggle]', mega);
        var megaPanel = $('[data-mega-panel]', mega);

        var setMega = function (open) {
            megaPanel.hidden = !open;
            megaToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Открытая кнопка краснеет: так клиент отличает её от обычного состояния.
            megaToggle.classList.toggle('bg-inv-red', open);
            megaToggle.classList.toggle('bg-inv-blue', !open);
        };

        megaToggle.addEventListener('click', function () {
            setMega(megaPanel.hidden);
        });

        mega.addEventListener('mouseleave', function () { setMega(false); });

        $$('[data-mega-section]', mega).forEach(function (link) {
            link.addEventListener('mouseenter', function () {
                var id = link.getAttribute('data-mega-section');
                $$('[data-mega-section]', mega).forEach(function (other) {
                    other.setAttribute('data-active', other === link ? 'true' : 'false');
                });
                $$('[data-mega-panel-for]', mega).forEach(function (panel) {
                    panel.hidden = panel.getAttribute('data-mega-panel-for') !== id;
                });
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMega(false);
        });
    }

    /* ---- Мобильное меню ---- */
    var menuToggle = $('[data-menu-toggle]');
    var menuPanel = $('[data-menu-panel]');
    if (menuToggle && menuPanel) {
        menuToggle.addEventListener('click', function () {
            var open = menuPanel.hidden;
            menuPanel.hidden = !open;
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
            $('[data-menu-icon="open"]', menuToggle).hidden = open;
            $('[data-menu-icon="close"]', menuToggle).hidden = !open;
        });
    }

    /* ---- Всплывающие окна: поиск и заявка ---- */
    var openModal = function (name) {
        var modal = $('[data-modal="' + name + '"]');
        if (!modal) return;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        var input = modal.querySelector('input:not([type="hidden"])');
        // preventScroll: иначе на низком экране браузер подтягивает поле к себе
        // и уводит шапку окна за верхнюю кромку.
        if (input) input.focus({ preventScroll: true });
    };

    var closeModals = function () {
        $$('[data-modal]').forEach(function (modal) { modal.hidden = true; });
        document.body.style.overflow = '';
    };

    $$('[data-search-open]').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal('search'); });
    });

    $$('[data-request]').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal('request'); });
    });

    $$('[data-modal-close]').forEach(function (btn) {
        btn.addEventListener('click', closeModals);
    });

    $$('[data-modal]').forEach(function (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal || e.target.parentElement === modal) closeModals();
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModals();
    });

    /* ---- Слайдер первого экрана ---- */
    var hero = $('[data-hero]');
    if (hero) {
        // Кадр и подпись — разные элементы одного слайда: переключаем парой.
        var images = $$('[data-hero-image]', hero);
        var texts = $$('[data-hero-text]', hero);
        var slides = texts.length ? texts : images;
        var dots = $$('[data-hero-dot]', hero);
        var index = 0;
        var timer = null;
        var STEP = 3500; // кадр держится 3,5 секунды — так попросил клиент

        var show = function (next) {
            index = (next + slides.length) % slides.length;
            [images, texts].forEach(function (group) {
                group.forEach(function (node, i) {
                    node.style.opacity = i === index ? '1' : '0';
                    node.style.pointerEvents = i === index ? 'auto' : 'none';
                });
            });
            dots.forEach(function (dot, i) {
                dot.setAttribute('aria-current', i === index ? 'true' : 'false');
                dot.classList.toggle('bg-white', i === index);
                dot.classList.toggle('bg-white/40', i !== index);
            });
        };

        var play = function () {
            clearInterval(timer);
            timer = setInterval(function () { show(index + 1); }, STEP);
        };

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () { show(i); play(); });
        });

        if (slides.length > 1) {
            show(0);
            play();
        }
    }
})();
