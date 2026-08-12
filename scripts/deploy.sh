#!/usr/bin/env bash
# Публикация собранного сайта в ветку gh-pages (GitHub Pages).
# Использование: npm run deploy
set -euo pipefail

cd "$(dirname "$0")/.."

REPO_URL="https://github.com/farik9797/invit.git"
SHA="$(git rev-parse --short HEAD)"

npm run build

cd dist
touch .nojekyll
# SPA-фолбэк: GitHub Pages отдаёт 404.html на любой вложенный адрес,
# роутер разбирает путь уже на клиенте (/catalog/... открывается по прямой ссылке).
cp index.html 404.html
[ -d .git ] || git init -q -b gh-pages
git add -A
git -c user.name=farik9797 -c user.email=farrukh.abdumadjidov@gmail.com \
  commit -q -m "Deploy $SHA" --allow-empty
git push -q --force "$REPO_URL" gh-pages:gh-pages

echo "Опубликовано: https://farik9797.github.io/invit/"
