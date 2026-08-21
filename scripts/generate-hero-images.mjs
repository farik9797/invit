/**
 * Генерация фонов для слайдера через Gemini.
 * Ключ берётся из .env.local (GEMINI_API_KEY), файл в .gitignore.
 *
 * Запуск: node scripts/generate-hero-images.mjs
 */
import { GoogleGenAI } from '@google/genai';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const readKey = () => {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const envPath = resolve(root, '.env.local');
  if (!existsSync(envPath)) throw new Error('Нет .env.local с GEMINI_API_KEY');
  const line = readFileSync(envPath, 'utf8')
    .split('\n')
    .find((l) => l.startsWith('GEMINI_API_KEY='));
  if (!line) throw new Error('В .env.local нет строки GEMINI_API_KEY=');
  return line.slice('GEMINI_API_KEY='.length).trim();
};

// Фоны уходят под тёмную подложку, поэтому важнее настроение и глубина, чем детали.
const COMMON =
  'Photorealistic wide cinematic photograph, 16:9, moody overcast light, deep shadows, ' +
  'desaturated dark palette with charcoal and cool green tones, shallow depth of field, ' +
  'documentary construction photography. Absolutely no text, no letters, no numbers, no logos, no watermarks.';

const SLIDES = [
  {
    file: 'hero-production.jpg',
    prompt:
      'Interior of a modern industrial plant producing adhesive sealing tape: rows of large tape rolls ' +
      'on a slitting and rewinding machine, steel frame, subtle green machine housing. ' + COMMON
  },
  {
    file: 'hero-window.jpg',
    prompt:
      'Construction detail: worker in gloves applying a silver metallized vapour barrier sealing tape ' +
      'around the joint of a white PVC window frame and a concrete wall opening, polyurethane foam visible in the gap. ' +
      COMMON
  },
  {
    file: 'hero-psul.jpg',
    prompt:
      'Macro construction detail: dark grey pre-compressed expanding foam sealing tape filling the gap ' +
      'between a window frame and a brick wall opening, visible porous foam texture, side light. ' + COMMON
  },
  {
    file: 'hero-panels.jpg',
    prompt:
      'Industrial roofing detail: dark polyethylene foam sealing tape between metal sandwich panels and ' +
      'galvanized steel profiles on a roof structure under an overcast sky. ' + COMMON
  }
];

// Модели, доступные ключу (проверено через ListModels). Пробуем по очереди:
// если у одной кончилась бесплатная квота — берём следующую.
const MODELS = [
  'gemini-3.1-flash-image',
  'gemini-3.1-flash-lite-image',
  'gemini-2.5-flash-image',
  'gemini-3-pro-image'
];

const ai = new GoogleGenAI({ apiKey: readKey() });
const outDir = resolve(root, 'public/hero');
mkdirSync(outDir, { recursive: true });

/** Пробует модели по очереди: сперва Imagen (умеет 16:9), затем Gemini Flash Image. */
const generate = async (prompt) => {
  const errors = [];

  for (const model of MODELS) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } }
      });
      const part = res.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
      if (part) return { model, bytes: part.inlineData.data };
      errors.push(`${model}: в ответе нет изображения`);
    } catch (err) {
      errors.push(`${model}: ${err.message?.slice(0, 160)}`);
    }
  }

  throw new Error(errors.join(' | '));
};

for (const slide of SLIDES) {
  process.stdout.write(`${slide.file} … `);
  try {
    const { model, bytes } = await generate(slide.prompt);
    writeFileSync(resolve(outDir, slide.file), Buffer.from(bytes, 'base64'));
    console.log(`готово (${model})`);
  } catch (err) {
    console.log(`не вышло\n   ${err.message}`);
  }
}
