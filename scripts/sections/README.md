# Плоские иконки разделов

Знаки клиента (`src/assets/sections/*.webp`) приходят растром со светотенью.
Рядом с векторными запасными из MDI они выглядели как другой набор, поэтому их
уплощают: альфа-канал → potrace → сплошная заливка одним цветом.

```
python3 flatten.py   # webp -> out/*.svg (плоский силуэт)
python3 gen.py       # out/*.svg -> src/lib/sectionIconPaths.ts
```

Нужен `potrace` (`brew install potrace`) и Pillow.

Два знака в `flatten.py` исключены списком `SKIP`: после уплощения крыша
становится похожа на шляпу, а короб воздуховода — на пятно. Для них в
`sectionIcons.tsx` взяты MDI.

`src/lib/sectionIconPaths.ts` генерируется — руками не править.
