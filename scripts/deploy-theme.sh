#!/usr/bin/env bash
# Выкладка темы invit-theme на хостинг (invit.by) по FTP.
#
# 1. Собирает данные и картинки React-сайта в тему (build-theme-data.sh)
#    и стили Tailwind.
# 2. Загружает сначала картинки, данные и вспомогательные файлы, потом
#    шаблоны верхнего уровня: так сайт не падает на середине загрузки —
#    functions.php не появится раньше файлов, которые он подключает.
#
# Доступы FTP берутся из password.md (в git его нет) и не печатаются.
set -euo pipefail
cd "$(dirname "$0")/.."

bash scripts/build-theme-data.sh
npx @tailwindcss/cli -i invit-theme/assets/css/source.css -o invit-theme/assets/css/app.css --minify

field() { sed -n '/^## FTP/,/^## /p' password.md | grep -m1 "$1" | sed -E 's/^[^:]*:[[:space:]]*//' | tr -d '`' | xargs; }
HOST=$(field 'Сервер')
USER=$(field 'Учётная запись')
PASS=$(field 'Пароль')

L="$PWD/invit-theme"
R=/www/invit.by/wp/wp-content/themes/invit-theme

lftp -u "$USER","$PASS" "$HOST" -e "
set ssl:verify-certificate no; set net:max-retries 2; set net:timeout 20;
mirror -R --only-newer --no-perms --parallel=6 $L/assets $R/assets;
mirror -R --only-newer --no-perms $L/data $R/data;
mirror -R --only-newer --no-perms --delete $L/inc $R/inc;
mirror -R --only-newer --no-perms --delete $L/template-parts $R/template-parts;
mirror -R --only-newer --no-perms --delete $L/woocommerce $R/woocommerce;
mirror -R --only-newer --no-perms --exclude-glob */ --exclude-glob README.md $L $R;
bye"

curl -s -o /dev/null -w "invit.by: %{http_code}\n" https://invit.by/
