#!/usr/bin/env python3
"""
Иконки темы WordPress из того же набора Lucide, на котором собран React-сайт.

Берёт каждое имя, которое React импортирует из lucide-react, находит файл
значка в node_modules (у части имён это псевдоним: AlertCircle -> circle-alert)
и пишет invit-theme/inc/icons.php. Рисовать пути руками нельзя — только копия.

Ключ в PHP — имя React в кебаб-регистре: CheckCircle2 -> check-circle-2.
"""
import glob
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LUCIDE = ROOT / 'node_modules/lucide-react/dist/esm'
OUT = ROOT / 'invit-theme/inc/icons.php'

# Значки, которых нет в React, но они нужны теме (корзина, уведомления).
EXTRA = ['Layers', 'Trash2', 'Minus', 'Clock', 'FileText', 'ShoppingCart']


def react_names():
    names = set(EXTRA)
    for path in glob.glob(str(ROOT / 'src/**/*.ts*'), recursive=True):
        text = Path(path).read_text(encoding='utf-8')
        for block in re.findall(r"import\s*\{([^}]*)\}\s*from\s*['\"]lucide-react['\"]", text, re.S):
            for name in block.split(','):
                name = name.strip().split(' as ')[0].strip()
                if name:
                    names.add(name)
    return sorted(names)


def alias_map():
    """Имя экспорта -> файл значка, по индексу пакета."""
    index = (LUCIDE / 'lucide-react.js').read_text(encoding='utf-8')
    out = {}
    for names, file in re.findall(r"export \{([^}]*)\} from '\./icons/([a-z0-9-]+)\.js'", index):
        for part in names.split(','):
            m = re.match(r'\s*default as (\w+)', part)
            if m:
                out[m.group(1)] = file
    return out


def kebab(name):
    s = re.sub(r'(?<=[a-z])(?=[A-Z0-9])|(?<=[0-9])(?=[A-Z])', '-', name).lower()
    # Grid2x2 -> grid-2x2, а не grid-2x-2: «x» здесь знак размера, не слово
    return re.sub(r'(\d)x-(\d)', r'\1x\2', s)


def svg_body(file):
    js = (LUCIDE / 'icons' / f'{file}.js').read_text(encoding='utf-8')
    node = re.search(r'const __iconNode = (\[.*?\]);\n', js, re.S).group(1)
    # Объект JS -> JSON: ключи без кавычек
    node = re.sub(r'(\w+):', r'"\1":', node)
    items = json.loads(node)
    parts = []
    for tag, attrs in items:
        attrs = {k: v for k, v in attrs.items() if k != 'key'}
        attr = ' '.join(f'{k}="{v}"' for k, v in attrs.items())
        parts.append(f'<{tag} {attr} />')
    return ''.join(parts)


def main():
    aliases = alias_map()
    lines = []
    for name in react_names():
        file = aliases.get(name)
        if not file:
            raise SystemExit(f'Нет значка {name} в lucide-react')
        body = svg_body(file).replace("'", "\\'")
        lines.append(f"        '{kebab(name)}' => '{body}',")

    OUT.write_text(f"""<?php
/**
 * Иконки темы — набор Lucide (lucide.dev, ISC), тот же, что у React-сайта.
 * Файл собирает scripts/build-theme-icons.py из node_modules — руками не править
 * и пути не рисовать: новый значок добавляется в EXTRA скрипта.
 */

if (!defined('ABSPATH')) exit;

function invit_icons() {{
    return [
{chr(10).join(lines)}
    ];
}}

/** Содержимое <svg> по имени значка Lucide. */
function invit_icon_body($name) {{
    return invit_icons()[$name] ?? '';
}}

/**
 * Готовый <svg>. Цвет наследуется от текста (currentColor), размер задаётся
 * классами Tailwind на самом элементе.
 */
function invit_icon($name, $class = 'w-5 h-5') {{
    $body = invit_icon_body($name);
    if ($body === '') return '';
    return sprintf(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        . 'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="%s" aria-hidden="true">%s</svg>',
        esc_attr($class),
        $body
    );
}}

/** Список значков для выбора в ACF. */
function invit_icon_choices() {{
    $names = array_keys(invit_icons());
    return array_combine($names, $names);
}}
""", encoding='utf-8')
    print(f'{len(lines)} значков -> {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
