#!/usr/bin/env bash
# Данные и картинки React-сайта -> тема WordPress (invit-theme).
#
# Тема показывает сайт точь-в-точь как React-версия, поэтому берёт у неё всё,
# что не живёт в WooCommerce: разделы с группами и описаниями, знаки разделов,
# новости, документы, реквизиты, подробные описания товаров и их иллюстрации.
# Товары, цены и снимки товаров — в базе WordPress, их здесь нет.
#
# Запуск: bash scripts/build-theme-data.sh (после изменений в src/data или src/assets).
set -euo pipefail
cd "$(dirname "$0")/.."

THEME=invit-theme
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

node_modules/.bin/esbuild scripts/theme-data/entry.ts --bundle --platform=node --format=cjs \
  --define:import.meta.env.BASE_URL='"/"' --outfile="$TMP/data.cjs" --log-level=warning
mkdir -p "$THEME/data"
node "$TMP/data.cjs" > "$THEME/data/site.json"

IMG="$THEME/assets/img"
cp public/favicon.svg "$IMG/favicon.svg"
for dir in about awards banners benefits categories certificates content hero icons logo news section-photos; do
  mkdir -p "$IMG/$dir"
  rsync -a --delete "src/assets/$dir/" "$IMG/$dir/"
done

mkdir -p "$THEME/assets/docs"
rsync -a --delete public/docs/ "$THEME/assets/docs/"

echo "site.json: $(du -h "$THEME/data/site.json" | cut -f1), картинки: $(du -sh "$IMG" | cut -f1), документы: $(du -sh "$THEME/assets/docs" | cut -f1)"
