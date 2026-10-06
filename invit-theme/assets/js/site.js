/*
 * Поведение сайта — перенос из React-версии (src/components/home-v2/Chrome.tsx,
 * Hero.tsx, Reveal.tsx, страницы каталога, товара и заявки). Без зависимостей:
 * то, что в React делали motion и GSAP, здесь — переходы CSS и
 * IntersectionObserver с теми же длительностями и кривыми.
 */
(function () {
    'use strict';

    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
    var CFG = window.INVIT || {};
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    };

    var plural = function (n, forms) {
        var mod100 = n % 100;
        if (mod100 >= 11 && mod100 <= 14) return forms[2];
        var mod10 = n % 10;
        if (mod10 === 1) return forms[0];
        if (mod10 >= 2 && mod10 <= 4) return forms[1];
        return forms[2];
    };

    var post = function (url, data) {
        var body = new FormData();
        Object.keys(data).forEach(function (k) { body.append(k, data[k]); });
        return fetch(url, { method: 'POST', body: body, credentials: 'same-origin' }).then(function (r) { return r.json(); });
    };

    /* ---- Появление при прокрутке (Reveal, Fade, FadeGroup) ---- */
    var revealAll = function (root) {
        var nodes = $$('[data-reveal]:not([data-shown]), [data-fade]:not([data-shown]), [data-fade-item]:not([data-shown])', root);
        if (!nodes.length) return;
        if (reduced || !('IntersectionObserver' in window)) {
            nodes.forEach(function (n) { n.setAttribute('data-shown', ''); });
            return;
        }
        var show = function (n) {
            var delay = parseFloat(n.getAttribute('data-delay') || '0');
            n.style.transitionDelay = delay ? delay + 's' : '';
            n.setAttribute('data-shown', '');
        };
        // Reveal: margin -60px; Fade (GSAP): «top 88%» — нижние 12% окна не в счёт
        var ioReveal = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                show(e.target);
                ioReveal.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -60px 0px' });
        var ioFade = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var group = e.target;
                if (group.hasAttribute('data-fade-group')) {
                    $$('[data-fade-item]', group).forEach(function (item, i) {
                        item.setAttribute('data-delay', String(i * parseFloat(group.getAttribute('data-stagger') || '0.06')));
                        show(item);
                    });
                } else {
                    show(group);
                }
                ioFade.unobserve(group);
            });
        }, { rootMargin: '0px 0px -12% 0px' });

        nodes.forEach(function (n) {
            if (n.hasAttribute('data-reveal')) ioReveal.observe(n);
            else if (n.hasAttribute('data-fade')) ioFade.observe(n);
        });
        $$('[data-fade-group]', root).forEach(function (g) { ioFade.observe(g); });
    };
    revealAll(document);

    /* ---- Числа, которые досчитываются (CountUp) ---- */
    $$('[data-countup]').forEach(function (el) {
        var value = parseInt(el.getAttribute('data-countup'), 10);
        if (reduced || !('IntersectionObserver' in window)) return;
        el.textContent = '0';
        var io = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            io.disconnect();
            var start = performance.now();
            var tick = function (now) {
                var t = Math.min(1, (now - start) / 900);
                var eased = 1 - Math.pow(1 - t, 2); // power2.out
                el.textContent = String(Math.round(value * eased));
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, { rootMargin: '0px 0px -8% 0px' });
        io.observe(el);
    });

    /* ---- Шапка уезжает при прокрутке вниз и возвращается вверх ---- */
    var header = $('[data-header]');
    var menuPanel = $('[data-menu-panel]');
    if (header) {
        var lastY = 0;
        var onScroll = function () {
            var y = Math.max(window.scrollY, 0);
            header.classList.toggle('shadow-[0_6px_24px_rgb(15_37_55_/_0.10)]', y > 8);
            var step = y - lastY;
            if (Math.abs(step) < 6) return;
            lastY = y;
            // Пока в шапке что-то раскрыто, не прячем: оно уехало бы вместе с ней
            var busy = header.querySelector('[aria-expanded="true"]');
            var hide = !busy && step > 0 && y > 200;
            header.classList.toggle('-translate-y-full', hide);
            header.classList.toggle('translate-y-0', !hide);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- Мега-меню каталога: содержимое приходит при первом наведении ---- */
    var mega = $('[data-mega]');
    if (mega) {
        var megaToggle = $('[data-mega-toggle]', mega);
        var megaPanel = $('[data-mega-panel]', mega);
        var megaBody = $('[data-mega-body]', mega);
        var megaLoad = null;

        var loadMega = function () {
            if (!megaLoad) {
                megaLoad = fetch(CFG.mega, { credentials: 'same-origin' })
                    .then(function (r) { return r.text(); })
                    .then(function (html) {
                        megaBody.innerHTML = html;
                        $$('[data-mega-row]', megaBody).forEach(function (row) {
                            var go = function () { setActive(row.getAttribute('data-mega-row')); };
                            row.addEventListener('mouseenter', go);
                            row.addEventListener('focus', go);
                        });
                    })
                    .catch(function () { megaLoad = null; });
            }
            return megaLoad;
        };

        var setMega = function (open) {
            megaPanel.hidden = !open;
            megaToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            // Открытая кнопка краснеет: так её отличают от остальных пунктов
            megaToggle.classList.toggle('bg-inv-red', open);
            megaToggle.classList.toggle('bg-inv-blue', !open);
            megaToggle.classList.toggle('hover:bg-inv-red', !open);
            $('[data-mega-chevron]', mega).classList.toggle('rotate-180', open);
        };

        var setActive = function (idx) {
            $$('[data-mega-row]', mega).forEach(function (row) {
                var on = row.getAttribute('data-mega-row') === String(idx);
                row.setAttribute('aria-current', on ? 'true' : 'false');
                row.classList.toggle('bg-inv-blue', on);
                row.classList.toggle('text-white', on);
                row.classList.toggle('text-inv-ink', !on);
                var mark = $('[data-mega-mark]', row);
                mark.classList.toggle('text-white', on);
                mark.classList.toggle('text-inv-blue', !on);
            });
            $$('[data-mega-section]', mega).forEach(function (panel) {
                panel.hidden = panel.getAttribute('data-mega-section') !== String(idx);
            });
        };

        megaToggle.addEventListener('mouseenter', loadMega);
        megaToggle.addEventListener('focus', loadMega);
        megaToggle.addEventListener('click', function () {
            var open = megaPanel.hidden;
            if (!open) return setMega(false);
            loadMega().then(function () { setMega(true); });
        });
        megaPanel.addEventListener('mouseleave', function () { setMega(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMega(false); });
        document.addEventListener('mousedown', function (e) {
            if (!megaPanel.hidden && !mega.contains(e.target)) setMega(false);
        });
    }

    /* ---- Мобильное меню ---- */
    var menuToggle = $('[data-menu-toggle]');
    if (menuToggle && menuPanel) {
        menuToggle.addEventListener('click', function () {
            var open = menuPanel.hidden;
            menuPanel.hidden = !open;
            menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
            $('[data-menu-icon="open"]', menuToggle).hidden = open;
            $('[data-menu-icon="close"]', menuToggle).hidden = !open;
            if (open && header) {
                header.classList.remove('-translate-y-full');
                header.classList.add('translate-y-0');
            }
        });
    }

    /* ---- Живой поиск: подсказка под полем и попап ---- */
    var searchTimer = null;
    var searchQuery = function (q, done) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            fetch(CFG.search + '&q=' + encodeURIComponent(q), { credentials: 'same-origin' })
                .then(function (r) { return r.json(); })
                .then(function (data) { done(data); })
                .catch(function () {});
        }, 120);
    };

    var resultRows = function (items, pad, img) {
        return '<ul' + (pad === 'drop' ? ' class="max-h-[52vh] overflow-y-auto"' : '') + '>' + items.map(function (p) {
            return '<li><a href="' + esc(p.url) + '" class="flex items-center gap-3 ' +
                (pad === 'drop' ? 'px-4 py-2.5' : 'px-5 sm:px-7 py-3') +
                ' hover:bg-inv-surface-1 transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue">' +
                '<img src="' + esc(p.image) + '" alt="" aria-hidden="true" loading="lazy" class="' + img + ' shrink-0 object-contain bg-white rounded-[4px] border border-inv-border-subtle p-1">' +
                '<span class="min-w-0"><span class="block text-sm text-inv-ink leading-snug line-clamp-2">' + esc(p.title) + '</span>' +
                (p.sku ? '<span class="mt-0.5 block text-xs text-inv-ink-muted">Артикул ' + esc(p.sku) + '</span>' : '') +
                '</span></a></li>';
        }).join('') + '</ul>';
    };

    var field = $('[data-search-field]');
    if (field) {
        var fieldInput = $('input[name="q"]', field);
        var drop = $('[data-search-drop]', field);
        var render = function () {
            var q = fieldInput.value.trim();
            if (!q || document.activeElement !== fieldInput && !field.contains(document.activeElement)) {
                drop.hidden = true;
                return;
            }
            searchQuery(q, function (data) {
                if (fieldInput.value.trim() !== q) return;
                if (!data.items.length) {
                    drop.innerHTML = '<p class="px-4 py-4 text-sm text-inv-ink-muted">Ничего не нашлось. Попробуйте короче или введите артикул.</p>';
                } else {
                    drop.innerHTML = resultRows(data.items, 'drop', 'w-10 h-10') +
                        '<a href="' + esc(CFG.catalog + '?q=' + encodeURIComponent(q)) + '" class="flex items-center justify-center min-h-11 border-t border-inv-border-subtle text-sm font-semibold text-inv-blue hover:bg-inv-surface-1 transition-colors duration-[120ms]">' +
                        'Показать все ' + data.count + ' ' + plural(data.count, ['позицию', 'позиции', 'позиций']) + '</a>';
                }
                drop.hidden = false;
            });
        };
        fieldInput.addEventListener('input', render);
        fieldInput.addEventListener('focus', render);
        fieldInput.addEventListener('keydown', function (e) { if (e.key === 'Escape') drop.hidden = true; });
        document.addEventListener('mousedown', function (e) { if (!field.contains(e.target)) drop.hidden = true; });
    }

    /* ---- Модалки: поиск на телефоне и «Обратный звонок» ---- */
    var openModal = function (name) {
        var modal = $('[data-modal="' + name + '"]');
        if (!modal) return null;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        // Появление: сначала показываем свёрнутым, в следующем кадре — переход
        requestAnimationFrame(function () {
            modal.classList.remove('opacity-0');
            var card = $('[data-modal-card]', modal);
            if (card) card.classList.remove('opacity-0', '-translate-y-3');
        });
        return modal;
    };

    var closeModals = function () {
        $$('[data-modal]').forEach(function (modal) {
            if (modal.hidden) return;
            modal.hidden = true;
            if (modal.getAttribute('data-modal') === 'search') {
                modal.classList.add('opacity-0');
                $('[data-modal-card]', modal).classList.add('opacity-0', '-translate-y-3');
            }
        });
        document.body.style.overflow = '';
        $$('[data-search-open]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    };

    $$('[data-modal-close]').forEach(function (btn) { btn.addEventListener('click', closeModals); });
    // По фону закрывается только поиск: окна звонка и документа в React
    // закрываются крестиком и кнопкой
    $$('[data-modal][data-backdrop-close]').forEach(function (modal) {
        modal.addEventListener('click', function (e) {
            if (!e.target.closest('[data-modal-card]')) closeModals();
        });
    });

    $$('[data-open-modal]').forEach(function (btn) {
        btn.addEventListener('click', function () { openModal(btn.getAttribute('data-open-modal')); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

    var searchModal = $('[data-modal="search"]');
    if (searchModal) {
        var modalInput = $('[data-search-input]', searchModal);
        var results = $('[data-search-results]', searchModal);
        var hints = $('[data-search-hints]', searchModal);
        var status = $('[data-search-status]', searchModal);
        var count = $('[data-search-count]', searchModal);
        var renderModal = function () {
            var q = modalInput.value.trim();
            hints.hidden = !!q;
            status.classList.toggle('mt-4', !q);
            status.classList.toggle('pt-4', !q);
            status.classList.toggle('border-t', !q);
            if (!q) {
                results.hidden = true;
                count.textContent = 'Ищем по названию и артикулу.';
                return;
            }
            searchQuery(q, function (data) {
                if (modalInput.value.trim() !== q) return;
                results.innerHTML = data.items.length
                    ? resultRows(data.items, 'modal', 'w-12 h-12')
                    : '<p class="px-5 py-6 sm:px-7 text-sm text-inv-ink-muted">По запросу «' + esc(q) + '» ничего не нашлось. Попробуйте короче или введите артикул.</p>';
                results.hidden = false;
                count.textContent = data.count > 0
                    ? 'Найдено ' + data.count + ' ' + plural(data.count, ['позиция', 'позиции', 'позиций']) + ' — Enter покажет все.'
                    : 'Ищем по названию и артикулу.';
            });
        };
        modalInput.addEventListener('input', renderModal);
        $$('[data-search-hint]', searchModal).forEach(function (btn) {
            btn.addEventListener('click', function () {
                modalInput.value = btn.getAttribute('data-search-hint');
                renderModal();
            });
        });
        $$('[data-search-open]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                openModal('search');
                btn.setAttribute('aria-expanded', 'true');
                // preventScroll: на низком экране поле не утягивает окно за край
                modalInput.focus({ preventScroll: true });
            });
        });
    }

    $$('[data-callback]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var modal = openModal('callback');
            if (!modal) return;
            $('[data-callback-source]', modal).value = btn.getAttribute('data-callback') || '';
            $('[data-form-done]', modal).hidden = true;
            $('form', modal).hidden = false;
            if (menuPanel && !menuPanel.hidden && menuToggle) menuToggle.click();
        });
    });

    /* ---- Формы заявки и звонка: отправка без перезагрузки ---- */
    // Значки берутся из набора Lucide, выведенного сервером (footer.php)
    var icon = function (name) {
        var tpl = document.getElementById('invit-icon-' + name);
        return tpl ? tpl.innerHTML.trim() : '';
    };
    var alertIcon = icon('alert-circle');

    $$('form[data-form]').forEach(function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var kind = form.getAttribute('data-form');

            // Проверка на месте, как в React: те же условия и те же подписи
            if (kind === 'request') {
                var errors = {};
                var val = function (n) { return (form.elements[n].value || '').trim(); };
                if (!val('name')) errors.name = 'Укажите, как к вам обращаться';
                if (!val('company')) errors.company = 'Укажите название организации или ИП';
                if (val('phone').replace(/\D/g, '').length < 9) errors.phone = 'Введите номер телефона полностью';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) errors.email = 'Введите адрес почты, например mail@company.by';
                ['name', 'company', 'phone', 'email'].forEach(function (n) {
                    var input = form.elements[n];
                    var holder = $('[data-error-for="' + n + '"]', form);
                    var hint = $('[data-hint-for="' + n + '"]', form);
                    input.classList.toggle('border-inv-error', !!errors[n]);
                    input.classList.toggle('border-inv-border', !errors[n]);
                    input.setAttribute('aria-invalid', errors[n] ? 'true' : 'false');
                    if (holder) {
                        holder.hidden = !errors[n];
                        holder.innerHTML = errors[n] ? alertIcon + esc(errors[n]) : '';
                    }
                    if (hint) hint.hidden = !!errors[n];
                });
                if (Object.keys(errors).length) return;
            }

            var submit = $('button[type="submit"]', form);
            var label = submit.innerHTML;
            submit.disabled = true;
            if (kind === 'request') submit.textContent = 'Отправляем';

            var data = { ajax: '1' };
            new FormData(form).forEach(function (v, k) { data[k] = v; });
            var fail = $('[data-form-error]', form);
            var showFail = function (message) {
                if (!fail) return;
                fail.innerHTML = alertIcon + esc(message || 'Не удалось отправить. Позвоните нам, пожалуйста.');
                fail.hidden = false;
            };
            if (fail) fail.hidden = true;
            post(form.action, data).then(function (res) {
                submit.disabled = false;
                submit.innerHTML = label;
                if (!res.success) return showFail(res.data && res.data.message);
                var wrap = form.closest('[data-form-wrap]') || form.parentElement;
                var done = $('[data-form-done]', wrap);
                form.hidden = true;
                form.reset();
                if (done) done.hidden = false;
            }).catch(function () {
                submit.disabled = false;
                submit.innerHTML = label;
                showFail();
            });
        });
    });

    $$('[data-form-again]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var wrap = btn.closest('[data-form-wrap]');
            $('[data-form-done]', wrap).hidden = true;
            $('form', wrap).hidden = false;
        });
    });

    /* ---- Заявка на счёт: счётчик в шапке и кнопки «В заявку» ---- */
    var setCartCount = function (n) {
        $$('[data-cart-count]').forEach(function (badge) {
            badge.textContent = String(n);
            badge.hidden = n === 0;
        });
        $$('[data-cart-link]').forEach(function (link) {
            link.setAttribute('aria-label', n ? 'Заявка на счёт, позиций: ' + n : 'Заявка пуста');
        });
    };

    var cart = function (data) {
        return post(CFG.cart, data).then(function (res) {
            if (res.success) setCartCount(res.data.count);
            return res;
        });
    };

    var checkIcon = icon('check');

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-add-to-quote]');
        if (!btn) return;
        e.preventDefault();
        var qtyInput = btn.getAttribute('data-qty-from') ? $(btn.getAttribute('data-qty-from')) : null;
        var qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
        cart({ op: 'add', id: btn.getAttribute('data-add-to-quote'), qty: qty }).then(function (res) {
            if (!res.success) return;
            // Карточка: «В заявке» с галочкой (ProductCard)
            if (btn.hasAttribute('data-card-button')) {
                btn.classList.remove('bg-inv-surface-1', 'hover:bg-inv-surface-2');
                btn.classList.add('bg-inv-surface-2');
                btn.setAttribute('aria-label', 'Уже в заявке');
                btn.innerHTML = checkIcon + (btn.hasAttribute('data-compact') ? '' : '<span class="hidden sm:inline whitespace-nowrap">В заявке</span>');
            }
            // Строка списка: та же замена подписи
            if (btn.hasAttribute('data-row-button')) {
                btn.classList.remove('bg-inv-surface-1', 'hover:bg-inv-surface-2');
                btn.classList.add('bg-inv-surface-2');
                btn.setAttribute('aria-label', 'Уже в заявке');
                btn.innerHTML = checkIcon + '<span>В заявке</span>';
            }
            // Страница товара: «Добавить ещё» и ссылка «Перейти к заявке»
            if (btn.hasAttribute('data-product-button')) {
                btn.classList.remove('bg-brand-blue', 'hover:bg-brand-blue-hover');
                btn.classList.add('bg-brand-navy', 'hover:bg-brand-navy/90');
                btn.innerHTML = checkIcon + 'Добавить ещё';
                var go = $('[data-go-cart]');
                if (go) go.hidden = false;
            }
        });
    });

    /* ---- Плавающие кнопки: наверх и каналы связи ---- */
    var toTop = $('[data-to-top]');
    if (toTop) {
        var topCheck = function () { toTop.hidden = window.scrollY <= window.innerHeight * 2; };
        topCheck();
        window.addEventListener('scroll', topCheck, { passive: true });
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    }

    var fab = $('[data-fab]');
    if (fab) {
        var fabToggle = $('[data-fab-toggle]', fab);
        var hiddenClasses = ['opacity-0', 'scale-75', 'translate-y-3', 'pointer-events-none'];
        var shownClasses = ['opacity-100', 'scale-100', 'translate-y-0'];
        var setFab = function (open) {
            fabToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            fabToggle.setAttribute('aria-label', open ? 'Закрыть контакты' : 'Связаться с нами');
            $('[data-fab-icon="open"]', fab).hidden = open;
            $('[data-fab-icon="close"]', fab).hidden = !open;
            $$('[data-fab-item]', fab).forEach(function (item) {
                item.style.transitionDelay = open ? item.getAttribute('data-delay') + 'ms' : '0ms';
                item.setAttribute('aria-hidden', open ? 'false' : 'true');
                item.tabIndex = open ? 0 : -1;
                hiddenClasses.forEach(function (c) { item.classList.toggle(c, !open); });
                shownClasses.forEach(function (c) { item.classList.toggle(c, open); });
            });
        };
        fabToggle.addEventListener('click', function () {
            setFab(fabToggle.getAttribute('aria-expanded') !== 'true');
        });
        $$('[data-fab-item]', fab).forEach(function (item) {
            item.addEventListener('click', function () { setFab(false); });
        });
        // Тычок мимо или Esc сворачивает: иначе столбик висит поверх страницы
        document.addEventListener('pointerdown', function (e) {
            if (fabToggle.getAttribute('aria-expanded') === 'true' && !fab.contains(e.target)) setFab(false);
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setFab(false); });
    }

    /* ---- Слайдер первого экрана (Hero.tsx) ---- */
    var hero = $('[data-hero]');
    if (hero) {
        var images = $$('[data-hero-image]', hero);
        var texts = $$('[data-hero-text]', hero);
        var dots = $$('[data-hero-dot]', hero);
        var counter = $('[data-hero-counter]', hero);
        var bar = $('[data-hero-progress]', hero);
        var active = 0;
        var paused = false;
        var timer = null;
        var DURATION = 5000; // кадр держится 5 секунд — правка клиента от 06.10 (было 3,5)
        var total = texts.length;

        // Грузим только текущий кадр и следующий
        var load = function (i) {
            var img = images[i];
            if (img && !img.getAttribute('src')) img.setAttribute('src', img.getAttribute('data-src'));
        };

        var progress = function () {
            if (!bar) return;
            bar.style.transition = 'none';
            bar.style.transform = 'scaleX(0)';
            if (paused || reduced) return;
            bar.getBoundingClientRect();
            bar.style.transition = 'transform ' + DURATION + 'ms linear';
            bar.style.transform = 'scaleX(1)';
        };

        var show = function (next) {
            active = (next + total) % total;
            load(active);
            load((active + 1) % total);
            images.forEach(function (img, i) {
                img.classList.toggle('opacity-90', i === active);
                img.classList.toggle('opacity-0', i !== active);
            });
            texts.forEach(function (text, i) {
                var on = i === active;
                text.setAttribute('aria-hidden', on ? 'false' : 'true');
                text.classList.toggle('pointer-events-none', !on);
                text.toggleAttribute('data-active', on);
                $$('a, button', text).forEach(function (el) { el.tabIndex = on ? 0 : -1; });
            });
            dots.forEach(function (dot, i) {
                var on = i === active;
                dot.setAttribute('aria-current', on ? 'true' : 'false');
                var line = dot.firstElementChild;
                line.classList.toggle('w-10', on);
                line.classList.toggle('bg-white', on);
                line.classList.toggle('w-4', !on);
                line.classList.toggle('bg-white/25', !on);
                line.classList.toggle('hover:bg-white/50', !on);
            });
            if (counter) counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
            progress();
            schedule();
        };

        var schedule = function () {
            clearTimeout(timer);
            if (reduced || paused) return;
            timer = setTimeout(function () { show(active + 1); }, DURATION);
        };

        dots.forEach(function (dot, i) { dot.addEventListener('click', function () { show(i); }); });
        // Листаем всегда; пауза только пока клавиатурный фокус внутри кадра
        hero.addEventListener('focusin', function () { paused = true; progress(); schedule(); });
        hero.addEventListener('focusout', function () { paused = false; progress(); schedule(); });

        var down = $('[data-hero-down]', hero);
        if (down) {
            down.addEventListener('click', function () {
                window.scrollTo({ top: window.innerHeight * 0.92, behavior: reduced ? 'auto' : 'smooth' });
            });
        }

        show(0);
    }


    /* ================= Каталог (CatalogPage.tsx и колонка разделов) ================= */
    var HEADER_BOTTOM = 134;

    var setCookie = function (name, value) {
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; SameSite=Lax';
    };

    var softNav = function (url, opts) {
        opts = opts || {};
        var main = $('main');
        var before = {
            drawer: !!$('[data-drawer][data-open]'),
            drawerScroll: ($('[data-drawer-panel]') || {}).scrollTop || 0,
            bar: !!($('[data-filterbar]') && !$('[data-filterbar]').hidden),
            facet: ($('[data-facet] [data-facet-toggle][aria-expanded="true"]') || { closest: function () { return null; } }).closest('[data-facet]')
        };
        var facetKey = before.facet ? before.facet.getAttribute('data-facet') : null;
        var blocks = $$('[data-block]').filter(function (b) { return !$('[data-block-body]', b).hidden; }).map(function (b) { return b.getAttribute('data-block'); });

        return fetch(url, { credentials: 'same-origin' })
            .then(function (r) { return r.text(); })
            .then(function (html) {
                var doc = new DOMParser().parseFromString(html, 'text/html');
                var next = doc.querySelector('main');
                if (!next) { location.href = url; return; }
                main.innerHTML = next.innerHTML;
                document.title = doc.title;
                // Знаки разделов новой выдачи: недостающие символы спрайта
                var sprite = $('[data-icon-sprite]');
                var nextSprite = doc.querySelector('[data-icon-sprite]');
                if (nextSprite) {
                    if (!sprite) {
                        document.body.appendChild(document.importNode(nextSprite, true));
                    } else {
                        $$('symbol', nextSprite).forEach(function (sym) {
                            if (!document.getElementById(sym.id)) sprite.appendChild(document.importNode(sym, true));
                        });
                    }
                }
                if (opts.push !== false) history.pushState({ soft: true }, '', url);
                // React-роутер прокручивает к началу при каждой смене адреса
                if (!before.drawer) window.scrollTo(0, 0);
                initCatalog(main);
                revealAll(main);
                $$('[data-block]', main).forEach(function (b) {
                    if (blocks.indexOf(b.getAttribute('data-block')) >= 0) setBlock(b, true);
                });
                if (before.bar) setBar(true);
                else if ($('[data-filterbar]', main)) setBar(false);
                if (before.drawer) {
                    setDrawer(true, true);
                    $('[data-drawer-panel]').scrollTop = before.drawerScroll;
                }
                if (facetKey && before.bar) {
                    var f = $('[data-facet="' + facetKey + '"]', main);
                    if (f) setFacet(f, true);
                }
            })
            .catch(function () { location.href = url; });
    };

    window.addEventListener('popstate', function () {
        if ($('[data-catalog]')) softNav(location.href, { push: false });
    });

    var setDrawer = function (open, instant) {
        var drawer = $('[data-drawer]');
        if (!drawer) return;
        var panel = $('[data-drawer-panel]', drawer);
        var backdrop = $('[data-drawer-backdrop]', drawer);
        if (instant) { panel.style.transition = 'none'; backdrop.style.transition = 'none'; }
        drawer.toggleAttribute('data-open', open);
        drawer.classList.toggle('pointer-events-none', !open);
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
        panel.classList.toggle('translate-x-0', open);
        panel.classList.toggle('-translate-x-full', !open);
        backdrop.classList.toggle('opacity-100', open);
        backdrop.classList.toggle('opacity-0', !open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (instant) {
            panel.getBoundingClientRect();
            panel.style.transition = '';
            backdrop.style.transition = '';
        }
    };

    var setBar = function (open) {
        var bar = $('[data-filterbar]');
        var toggle = $('[data-filterbar-toggle]');
        if (!bar || !toggle) return;
        bar.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        $('[data-chevron]', toggle).classList.toggle('rotate-180', open);
        var active = !!$('.rounded-full', toggle);
        var lit = open || active;
        toggle.classList.toggle('border-inv-blue', lit);
        toggle.classList.toggle('border-inv-border', !lit);
        toggle.classList.toggle('hover:border-inv-blue', !lit);
    };

    var setFacet = function (facet, open) {
        var toggle = $('[data-facet-toggle]', facet);
        if (open) renderFacetList($('[data-facet-body]', facet));
        $('[data-facet-pop]', facet).hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        $('[data-chevron]', toggle).classList.toggle('rotate-180', open);
        var lit = open || !!$('.rounded-full', toggle);
        toggle.classList.toggle('border-inv-blue', lit);
        toggle.classList.toggle('border-inv-border', !lit);
        toggle.classList.toggle('hover:border-inv-blue', !lit);
    };

    var setBlock = function (block, open) {
        if (open) renderFacetList($('[data-block-body]', block));
        $('[data-block-body]', block).hidden = !open;
        var toggle = $('[data-block-toggle]', block);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        $('[data-chevron]', toggle).classList.toggle('-rotate-90', !open);
    };

    /* Отбор из адреса и обратно — те же параметры и тот же порядок, что у React */
    var FACET_PARAM = { brands: 'brand', countries: 'country', diameter: 'd', length: 'l' };
    var toggleUrl = function (key, value) {
        var url = new URL(location.href);
        var read = function (k) { return (url.searchParams.get(k) || '').split(',').map(function (v) { return v.trim(); }).filter(Boolean); };
        var lists = { brand: read('brand'), country: read('country'), d: read('d'), l: read('l') };
        var name = FACET_PARAM[key];
        var at = lists[name].indexOf(value);
        if (at >= 0) lists[name].splice(at, 1); else lists[name].push(value);
        var keep = { sub: url.searchParams.get('sub'), q: url.searchParams.get('q'), sort: url.searchParams.get('sort') };
        var params = new URLSearchParams();
        if (keep.sub) params.set('sub', keep.sub);
        if (keep.q && keep.q.trim()) params.set('q', keep.q.trim());
        ['brand', 'country', 'd', 'l'].forEach(function (k) { if (lists[k].length) params.set(k, lists[k].join(',')); });
        if (keep.sort && keep.sort !== 'default') params.set('sort', keep.sort);
        var qs = params.toString();
        return url.origin + url.pathname + (qs ? '?' + qs : '');
    };

    /* Список значений с флажками (FacetList.tsx) — рисуется при раскрытии */
    var renderFacetList = function (body) {
        if (body.hasAttribute('data-ready')) return;
        var data = JSON.parse(($('[data-facets]') || {}).textContent || '{}')[body.getAttribute('data-facet-body')];
        if (!data) return;
        body.setAttribute('data-ready', '');
        var key = body.getAttribute('data-facet-body');
        var check = icon('check').replace('stroke-width="2"', 'stroke-width="3"').replace('w-4 h-4', 'w-3 h-3');
        var expanded = false;
        var needle = '';

        var draw = function () {
            var q = needle.trim().toLowerCase();
            var found = data.options.filter(function (o) { return !q || o[0].toLowerCase().indexOf(q) >= 0; });
            var visible = (expanded || q) ? found : found.slice(0, data.preview).concat(found.slice(data.preview).filter(function (o) { return data.selected.indexOf(o[0]) >= 0; }));
            var hidden = found.length - visible.length;

            $('[data-rows]', body).innerHTML = visible.map(function (o) {
                var on = data.selected.indexOf(o[0]) >= 0;
                return '<li><button type="button" data-value="' + esc(o[0]) + '" aria-pressed="' + on + '" class="w-full flex items-center gap-2.5 min-h-9 py-1 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue rounded-[4px]">' +
                    '<span class="w-[18px] h-[18px] shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-[120ms] ' + (on ? 'bg-inv-blue border-inv-blue text-white' : 'border-inv-border bg-white group-hover:border-inv-blue') + '">' + (on ? check : '') + '</span>' +
                    '<span class="flex-1 text-[13px] leading-snug ' + (on ? 'text-inv-ink font-semibold' : 'text-inv-ink group-hover:text-inv-blue') + '">' + esc(o[0]) + '</span>' +
                    '<span class="text-[11px] tabular-nums text-inv-ink-muted">' + o[1] + '</span></button></li>';
            }).join('');
            $('[data-empty]', body).hidden = found.length > 0;
            var more = $('[data-more-values]', body);
            more.hidden = !(hidden > 0);
            more.textContent = 'Показать все (' + found.length + ')';
            $('[data-less-values]', body).hidden = !(expanded && !q && found.length > data.preview);
        };

        body.innerHTML = (data.options.length > 12
            ? '<span class="relative block mb-2"><span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-inv-ink-muted">' + icon('search').replace('w-4 h-4', 'w-3.5 h-3.5') + '</span>' +
              '<input data-needle placeholder="Найти в «' + esc(data.title.toLowerCase()) + '»" aria-label="Поиск: ' + esc(data.title) + '" class="w-full h-9 pl-8 pr-2 rounded-[4px] border border-inv-border bg-white text-[13px] text-inv-ink placeholder:text-inv-ink-muted focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-inv-blue"></span>'
            : '') +
            '<ul data-rows></ul>' +
            '<p data-empty hidden class="py-2 text-[13px] text-inv-ink-muted">Ничего не нашлось</p>' +
            '<button type="button" data-more-values hidden class="mt-1 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]"></button>' +
            '<button type="button" data-less-values hidden class="mt-1 min-h-9 text-[13px] font-semibold text-inv-blue hover:text-inv-blue-pressed cursor-pointer transition-colors duration-[120ms]">Свернуть</button>';

        var input = $('[data-needle]', body);
        if (input) input.addEventListener('input', function () { needle = input.value; draw(); });
        $('[data-more-values]', body).addEventListener('click', function () { expanded = true; draw(); });
        $('[data-less-values]', body).addEventListener('click', function () { expanded = false; draw(); });
        $('[data-rows]', body).addEventListener('click', function (e) {
            var btn = e.target.closest('[data-value]');
            if (btn) softNav(toggleUrl(key, btn.getAttribute('data-value')));
        });
        draw();
    };

    var initSections = function (box) {
        var rows = $$('[data-sections-row]', box);
        var shownSlug = null;
        var close = function () {
            if (!shownSlug) return;
            $$('[data-sections-panel]', box).forEach(function (p) { p.hidden = true; });
            rows.forEach(function (row) { paintRow(row, false); });
            shownSlug = null;
        };
        var paintRow = function (row, open) {
            var idle = row.getAttribute('data-idle').split(' ');
            idle.forEach(function (c) { row.classList.toggle(c, !open); });
            ['bg-inv-blue', 'text-white', 'font-semibold'].forEach(function (c) {
                if (open) row.classList.add(c);
            });
            if (!open) {
                row.classList.remove('bg-inv-blue', 'text-white');
                if (idle.indexOf('font-semibold') < 0) row.classList.remove('font-semibold');
            }
            var count = $('[data-count]', row);
            count.classList.toggle('text-white/70', open);
            count.classList.toggle('text-inv-ink-muted', !open);
            var arrow = $('[data-arrow]', row);
            arrow.classList.toggle('text-white', open);
            arrow.classList.toggle('text-inv-ink-muted/60', !open);
            $('[data-mark]', row).classList.toggle('text-white', open);
        };
        var open = function (row) {
            var slug = row.getAttribute('data-sections-row');
            if (shownSlug === slug) return;
            close();
            shownSlug = slug;
            paintRow(row, true);
            var panel = $('[data-sections-panel="' + slug + '"]', box);
            panel.hidden = false;
            // Панель встаёт у своей строки и целиком помещается в окно
            var anchor = row.offsetTop;
            var boxTop = box.getBoundingClientRect().top;
            var height = panel.getBoundingClientRect().height;
            var top = boxTop + anchor;
            var lowest = window.innerHeight - height - 12;
            var highest = HEADER_BOTTOM + 12;
            var fixed = Math.max(highest, Math.min(top, lowest));
            panel.style.top = (fixed - boxTop) + 'px';
        };
        rows.forEach(function (row) {
            row.addEventListener('mouseenter', function () { open(row); });
            row.addEventListener('focus', function () { open(row); });
        });
        $$('[data-sections-calm]', box).forEach(function (el) { el.addEventListener('mouseenter', close); });
        box.addEventListener('mouseleave', close);
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    };

    var initCatalogSearch = function (wrap) {
        var input = $('input[name="q"]', wrap);
        var drop = $('[data-catalog-drop]', wrap);
        var clear = $('[data-search-clear]', wrap);
        var apply = function (value) {
            drop.hidden = true;
            value = value.trim();
            softNav(value ? CFG.catalog + '?q=' + encodeURIComponent(value) : wrap.getAttribute('data-clear-url'));
        };
        var render = function () {
            var q = input.value.trim();
            clear.hidden = !input.value;
            if (!q || document.activeElement !== input) { drop.hidden = true; return; }
            searchQuery(q, function (data) {
                if (input.value.trim() !== q) return;
                if (!data.items.length) {
                    drop.innerHTML = '<p class="px-4 py-4 text-sm text-inv-ink-muted">Ничего не нашлось. Попробуйте короче или введите артикул.</p>';
                } else {
                    drop.innerHTML = '<ul class="max-h-[52vh] overflow-y-auto">' + data.items.map(function (p) {
                        return '<li><a href="' + esc(p.url) + '" class="flex items-center gap-3 px-3 py-2.5 hover:bg-inv-surface-1 transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inv-blue">' +
                            '<span class="w-10 h-10 shrink-0 flex items-center justify-center rounded-[4px] border border-inv-border-subtle bg-white p-1">' +
                            (p.image ? '<img src="' + esc(p.image) + '" alt="" aria-hidden="true" loading="lazy" class="w-full h-full object-contain">' : p.icon) +
                            '</span><span class="min-w-0"><span class="block text-[13px] text-inv-ink leading-snug line-clamp-2">' + esc(p.title) + '</span>' +
                            (p.sku ? '<span class="mt-0.5 block text-xs text-inv-ink-muted">Артикул ' + esc(p.sku) + '</span>' : '') +
                            '</span></a></li>';
                    }).join('') + '</ul>' +
                        '<button type="button" data-apply class="w-full flex items-center justify-center min-h-11 border-t border-inv-border-subtle text-sm font-semibold text-inv-blue cursor-pointer hover:bg-inv-surface-1 transition-colors duration-[120ms]">Показать все ' +
                        data.count + ' ' + plural(data.count, ['позицию', 'позиции', 'позиций']) + '</button>';
                    $('[data-apply]', drop).addEventListener('click', function () { apply(input.value); });
                }
                drop.hidden = false;
            });
        };
        input.addEventListener('input', render);
        input.addEventListener('focus', render);
        input.addEventListener('keydown', function (e) { if (e.key === 'Escape') drop.hidden = true; });
        document.addEventListener('mousedown', function (e) { if (!wrap.contains(e.target)) drop.hidden = true; });
        $('form', wrap).addEventListener('submit', function (e) { e.preventDefault(); apply(input.value); });
        clear.addEventListener('click', function () { input.value = ''; apply(''); });
    };

    var initCatalog = function (root) {
        var catalog = $('[data-catalog]', root);
        if (!catalog) return;

        $$('[data-drawer-open]', catalog).forEach(function (b) { b.addEventListener('click', function () { setDrawer(true); }); });
        $$('[data-drawer-close], [data-drawer-backdrop]', catalog).forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });

        var barToggle = $('[data-filterbar-toggle]', catalog);
        if (barToggle) barToggle.addEventListener('click', function () { setBar($('[data-filterbar]').hidden); });

        $$('[data-facet]', catalog).forEach(function (facet) {
            $('[data-facet-toggle]', facet).addEventListener('click', function () {
                var open = $('[data-facet-pop]', facet).hidden;
                $$('[data-facet]', catalog).forEach(function (f) { if (f !== facet) setFacet(f, false); });
                setFacet(facet, open);
            });
        });

        $$('[data-block]', catalog).forEach(function (block) {
            if (!$('[data-block-body]', block).hidden) renderFacetList($('[data-block-body]', block));
            $('[data-block-toggle]', block).addEventListener('click', function () {
                setBlock(block, $('[data-block-body]', block).hidden);
            });
        });

        var tree = $('[data-tree]', catalog);
        if (tree) {
            var treeToggle = $('[data-tree-toggle]', tree);
            treeToggle.addEventListener('click', function () {
                var open = treeToggle.getAttribute('aria-expanded') !== 'true';
                treeToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                treeToggle.classList.toggle('border-b', open);
                $('[data-tree-body]', tree).hidden = !open;
                $('[data-tree-where]', tree).hidden = open;
                $('[data-tree-spacer]', tree).hidden = !open;
                $('[data-chevron]', treeToggle).classList.toggle('-rotate-90', !open);
            });
            var subMore = $('[data-sub-more]', tree);
            var subLess = $('[data-sub-less]', tree);
            var setSubs = function (all) {
                $$('[data-sub-tail]', tree).forEach(function (li) { li.hidden = !all; });
                subMore.hidden = all;
                subLess.hidden = !all;
            };
            if (subMore) subMore.addEventListener('click', function () { setSubs(true); });
            if (subLess) subLess.addEventListener('click', function () { setSubs(false); });
        }

        $$('[data-sections]', catalog).forEach(initSections);
        $$('[data-catalog-search]', catalog).forEach(initCatalogSearch);

        // Описание раздела: показываем начало, целиком — по кнопке
        var info = $('[data-category-info]', catalog);
        if (info) {
            var infoBody = $('[data-info-body]', info);
            var infoToggle = $('[data-info-toggle]', info);
            var fits = infoBody.scrollHeight <= infoBody.clientHeight + 24;
            var setInfo = function (open) {
                infoBody.classList.toggle('max-h-[260px]', !open);
                $('[data-info-fade]', info).hidden = open;
                infoToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                $('[data-info-label]', info).textContent = open ? 'Свернуть' : 'Читать полностью';
                $('[data-chevron]', infoToggle).classList.toggle('rotate-180', open);
            };
            if (fits) {
                setInfo(true);
                infoToggle.hidden = true;
                infoBody.classList.add('pb-5', 'sm:pb-6');
            } else {
                infoBody.classList.add('pb-2');
                infoToggle.classList.add('mb-3');
                infoToggle.addEventListener('click', function () {
                    setInfo(infoToggle.getAttribute('aria-expanded') !== 'true');
                });
            }
        }

        var sort = $('[data-sort]', catalog);
        if (sort) sort.addEventListener('change', function () { softNav(sort.selectedOptions[0].getAttribute('data-url')); });

        $$('[data-view]', catalog).forEach(function (btn) {
            btn.addEventListener('click', function () {
                var view = btn.getAttribute('data-view');
                setCookie('invit_view', view);
                try { localStorage.setItem('invit:catalog-view', view); } catch (e) { /* приватный режим */ }
                softNav(location.href, { push: false });
            });
        });

        var more = $('[data-more]', catalog);
        if (more) {
            more.addEventListener('click', function () {
                var offset = parseInt(more.getAttribute('data-more'), 10);
                var url = new URL(location.href);
                url.searchParams.set('invit_more', String(offset));
                more.disabled = true;
                fetch(url.toString(), { credentials: 'same-origin' }).then(function (r) {
                    var remaining = parseInt(r.headers.get('X-Invit-Remaining') || '0', 10);
                    return r.text().then(function (html) { return { html: html, remaining: remaining }; });
                }).then(function (res) {
                    var results = $('[data-results]', catalog);
                    results.insertAdjacentHTML('beforeend', res.html);
                    revealAll(results);
                    var total = parseInt(catalog.getAttribute('data-total'), 10);
                    var shown = total - res.remaining;
                    $('[data-shown-label]', catalog).textContent = 'Показано ' + shown + ' из ' + total + ' ' + plural(total, ['позиции', 'позиций', 'позиций']);
                    if (res.remaining > 0) {
                        more.setAttribute('data-more', String(shown));
                        more.textContent = 'Показать ещё (' + res.remaining + ')';
                        more.disabled = false;
                    } else {
                        $('[data-more-wrap]', catalog).remove();
                    }
                });
            });
        }

        $$('a[data-soft]', catalog).forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                softNav(link.href);
            });
        });
    };

    document.addEventListener('mousedown', function (e) {
        $$('[data-facet]').forEach(function (f) {
            if (!f.contains(e.target) && !$('[data-facet-pop]', f).hidden) setFacet(f, false);
        });
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        $$('[data-facet]').forEach(function (f) { setFacet(f, false); });
        if ($('[data-drawer][data-open]')) setDrawer(false);
    });

    initCatalog(document);


    /* ================= Страница товара (ProductPage.tsx, Lightbox.tsx) ================= */
    var productBox = $('[data-product]');
    if (productBox) {
        var gallery = JSON.parse(productBox.getAttribute('data-gallery') || '[]');
        var captions = JSON.parse(productBox.getAttribute('data-captions') || '[]');
        var activePhoto = 0;
        var photo = $('[data-photo]', productBox);
        var thumbs = $$('[data-thumb]', productBox);

        var setPhoto = function (idx) {
            activePhoto = idx;
            if (photo) { photo.src = gallery[idx]; photo.alt = captions[idx] || ''; }
            thumbs.forEach(function (t, i) {
                t.classList.toggle('border-brand-blue', i === idx);
                t.classList.toggle('border-line', i !== idx);
                t.classList.toggle('hover:border-brand-sky', i !== idx);
            });
        };

        var box = $('[data-lightbox]');
        var lbIndex = null;
        var showLightbox = function (idx) {
            if (!box || !gallery.length) return;
            lbIndex = (idx + gallery.length) % gallery.length;
            $('[data-lightbox-image]', box).src = gallery[lbIndex];
            $('[data-lightbox-image]', box).alt = captions[lbIndex] || '';
            var many = gallery.length > 1;
            $('[data-lightbox-prev]', box).hidden = !many;
            $('[data-lightbox-next]', box).hidden = !many;
            $('[data-lightbox-count]', box).hidden = !many;
            $('[data-lightbox-count]', box).textContent = (lbIndex + 1) + ' / ' + gallery.length;
            box.hidden = false;
            document.body.style.overflow = 'hidden';
            setPhoto(lbIndex);
        };
        var closeLightbox = function () {
            if (!box || box.hidden) return;
            box.hidden = true;
            lbIndex = null;
            document.body.style.overflow = '';
        };

        var open = $('[data-photo-open]', productBox);
        if (open) open.addEventListener('click', function () { showLightbox(activePhoto); });
        thumbs.forEach(function (t, i) {
            t.addEventListener('click', function () { setPhoto(i); });
            t.addEventListener('dblclick', function () { showLightbox(i); });
        });

        // В описании — локальная копия иллюстрации, в галерее — та же картинка
        // из медиатеки: сверяем по имени файла
        $$('[data-content-image]', productBox).forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name = btn.getAttribute('data-content-image');
                var idx = -1;
                gallery.forEach(function (src, i) {
                    var file = src.split('/').pop().replace(/\.[a-z0-9]+$/i, '');
                    if (idx < 0 && (file === name || file.indexOf(name) === 0)) idx = i;
                });
                showLightbox(idx >= 0 ? idx : 0);
            });
        });

        if (box) {
            box.addEventListener('click', closeLightbox);
            $('[data-lightbox-image]', box).addEventListener('click', function (e) { e.stopPropagation(); });
            $('[data-lightbox-close]', box).addEventListener('click', closeLightbox);
            $('[data-lightbox-prev]', box).addEventListener('click', function (e) { e.stopPropagation(); showLightbox(lbIndex - 1); });
            $('[data-lightbox-next]', box).addEventListener('click', function (e) { e.stopPropagation(); showLightbox(lbIndex + 1); });
            document.addEventListener('keydown', function (e) {
                if (lbIndex === null) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
                if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
            });
        }

        // Количество: клиент просил класть в заявку несколько сразу
        var qtyWrap = $('[data-qty]', productBox);
        if (qtyWrap) {
            var qty = $('input', qtyWrap);
            var minus = $('[data-qty-step="-1"]', qtyWrap);
            var sync = function (v) {
                v = Math.max(1, Math.round(Number(v) || 1));
                qty.value = String(v);
                minus.disabled = v <= 1;
            };
            $$('[data-qty-step]', qtyWrap).forEach(function (b) {
                b.addEventListener('click', function () { sync(parseInt(qty.value, 10) + parseInt(b.getAttribute('data-qty-step'), 10)); });
            });
            qty.addEventListener('change', function () { sync(qty.value); });
        }
    }


    /* ================= Заявка на счёт (CartPage.tsx) ================= */
    var cartPage = $('[data-cart-page]');
    if (cartPage) {
        var summary = function (state) {
            var lines = state.count;
            $('[data-cart-summary]', cartPage).textContent = lines
                ? lines + ' ' + plural(lines, ['позиция', 'позиции', 'позиций']) + ', всего ' + state.units + ' ед.'
                : 'Здесь появятся позиции, которые вы отметите в каталоге.';
            var l = $('[data-cart-lines]', cartPage);
            var u = $('[data-cart-units]', cartPage);
            if (l) l.textContent = String(lines);
            if (u) u.textContent = String(state.units);
            if (!lines) {
                var filled = $('[data-cart-filled]', cartPage);
                if (filled) filled.remove();
                $('[data-cart-empty]', cartPage).hidden = false;
            }
        };

        $$('[data-cart-line]', cartPage).forEach(function (row) {
            var key = row.getAttribute('data-cart-line');
            var input = $('[data-line-qty]', row);
            var minus = $('[data-line-step="-1"]', row);
            var setQty = function (v) {
                v = Math.max(1, Math.round(Number(v) || 1));
                input.value = String(v);
                minus.disabled = v <= 1;
                cart({ op: 'qty', key: key, qty: v }).then(function (res) { if (res.success) summary(res.data); });
            };
            $$('[data-line-step]', row).forEach(function (b) {
                b.addEventListener('click', function () { setQty(parseInt(input.value, 10) + parseInt(b.getAttribute('data-line-step'), 10)); });
            });
            input.addEventListener('change', function () { setQty(input.value); });
            $('[data-line-remove]', row).addEventListener('click', function () {
                cart({ op: 'remove', key: key }).then(function (res) {
                    if (!res.success) return;
                    row.remove();
                    summary(res.data);
                });
            });
        });

        var clearBtn = $('[data-clear]', cartPage);
        if (clearBtn) {
            var confirmBox = $('[data-clear-confirm]', cartPage);
            clearBtn.addEventListener('click', function () { clearBtn.hidden = true; confirmBox.hidden = false; });
            $('[data-clear-no]', cartPage).addEventListener('click', function () { clearBtn.hidden = false; confirmBox.hidden = true; });
            $('[data-clear-yes]', cartPage).addEventListener('click', function () {
                cart({ op: 'clear' }).then(function (res) { if (res.success) summary(res.data); });
            });
        }

        var order = $('[data-order-form]', cartPage);
        if (order) {
            var agree = $('[data-agree]', order);
            var submit = $('button[type="submit"]', order);
            var unp = order.elements.unp;
            agree.addEventListener('change', function () { submit.disabled = !agree.checked; });
            unp.addEventListener('input', function () { unp.value = unp.value.replace(/\D/g, '').slice(0, 9); });

            order.addEventListener('submit', function (e) {
                e.preventDefault();
                var val = function (n) { return (order.elements[n].value || '').trim(); };
                var errors = {};
                if (!val('company')) errors.company = 'Укажите организацию или ИП';
                if (!/^\d{9}$/.test(val('unp'))) errors.unp = 'УНП — ровно девять цифр';
                if (!val('person')) errors.person = 'Укажите, с кем связаться';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('email'))) errors.email = 'Счёт придёт на этот адрес — проверьте его';
                if (val('phone').replace(/\D/g, '').length < 9) errors.phone = 'Введите номер телефона полностью';
                var hint = alertIcon.replace('w-4 h-4', 'w-3.5 h-3.5');
                ['company', 'unp', 'person', 'email', 'phone'].forEach(function (n) {
                    var input = order.elements[n];
                    var holder = $('[data-error-for="' + n + '"]', order);
                    input.classList.toggle('border-inv-error', !!errors[n]);
                    input.classList.toggle('border-inv-border', !errors[n]);
                    input.setAttribute('aria-invalid', errors[n] ? 'true' : 'false');
                    holder.hidden = !errors[n];
                    holder.innerHTML = errors[n] ? hint + esc(errors[n]) : '';
                });
                if (Object.keys(errors).length || !agree.checked) return;

                submit.disabled = true;
                var data = { ajax: '1' };
                new FormData(order).forEach(function (v, k) { data[k] = v; });
                var fail = $('[data-form-error]', order);
                fail.hidden = true;
                post(order.action, data).then(function (res) {
                    submit.disabled = false;
                    if (!res.success) {
                        fail.innerHTML = hint + esc((res.data && res.data.message) || 'Не удалось отправить заявку. Позвоните нам, пожалуйста.');
                        fail.hidden = false;
                        return;
                    }
                    setCartCount(0);
                    $('[data-cart-main]', cartPage).hidden = true;
                    $('[data-cart-done]', cartPage).hidden = false;
                    window.scrollTo(0, 0);
                }).catch(function () {
                    submit.disabled = false;
                    fail.innerHTML = hint + esc('Не удалось отправить заявку. Позвоните нам, пожалуйста.');
                    fail.hidden = false;
                });
            });
        }
    }


    /* ---- Вкладки «О компании» ---- */
    $$('[data-tabs]').forEach(function (box) {
        var tabs = $$('[data-tab]', box);
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var idx = tab.getAttribute('data-tab');
                tabs.forEach(function (t) {
                    var on = t === tab;
                    t.setAttribute('aria-selected', on ? 'true' : 'false');
                    t.getAttribute('data-on').split(' ').forEach(function (c) { t.classList.toggle(c, on); });
                    t.getAttribute('data-off').split(' ').forEach(function (c) { t.classList.toggle(c, !on); });
                });
                $$('[data-tab-panel]', box).forEach(function (panel) {
                    panel.hidden = panel.getAttribute('data-tab-panel') !== idx;
                });
            });
        });
    });


    /* ---- Один кадр во весь экран: диплом 2013 ---- */
    $$('[data-zoom]').forEach(function (btn) {
        var box = $('[data-lightbox]');
        if (!box) return;
        var close = function () {
            box.hidden = true;
            document.body.style.overflow = '';
        };
        btn.addEventListener('click', function () {
            var img = $('[data-lightbox-image]', box);
            img.src = btn.getAttribute('data-zoom');
            img.alt = btn.getAttribute('data-zoom-alt') || '';
            ['[data-lightbox-prev]', '[data-lightbox-next]', '[data-lightbox-count]'].forEach(function (sel) { $(sel, box).hidden = true; });
            box.hidden = false;
            document.body.style.overflow = 'hidden';
        });
        if (!box.hasAttribute('data-zoom-ready') && !$('[data-product]')) {
            box.setAttribute('data-zoom-ready', '');
            box.addEventListener('click', close);
            $('[data-lightbox-image]', box).addEventListener('click', function (e) { e.stopPropagation(); });
            $('[data-lightbox-close]', box).addEventListener('click', close);
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) close(); });
        }
    });

    window.INVIT_UI = { cart: cart, setCartCount: setCartCount, revealAll: revealAll, openModal: openModal, closeModals: closeModals, esc: esc, plural: plural, post: post, $: $, $$: $$ };
})();
