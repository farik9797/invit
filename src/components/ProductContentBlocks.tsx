import React from 'react';
import { ContentBlock } from '../types';

interface Props {
  blocks: ContentBlock[];
  onImageClick: (src: string) => void;
}

/** После группировки одиночных `image` не остаётся — только `gallery`. */
type Group = Exclude<ContentBlock, { kind: 'image' }> | { kind: 'gallery'; images: string[] };

/**
 * Идущие подряд иллюстрации собираем в одну группу: по три в ряд они читаются
 * как набор, а не как лента на всю ширину. Заодно каждая уменьшается примерно
 * до 255px и перестаёт растягиваться выше своего разрешения.
 */
const groupImages = (blocks: ContentBlock[]): Group[] => {
  const out: Group[] = [];

  for (const block of blocks) {
    const last = out[out.length - 1];
    if (block.kind === 'image' && last && last.kind === 'gallery') {
      last.images.push(block.src);
    } else if (block.kind === 'image') {
      out.push({ kind: 'gallery', images: [block.src] });
    } else {
      out.push(block);
    }
  }

  return out;
};

/** Описание товара как на invit.by: заголовки, абзацы, списки, таблицы и иллюстрации. */
export const ProductContentBlocks: React.FC<Props> = ({ blocks, onImageClick }) => (
  <div className="space-y-5">
    {groupImages(blocks).map((block, idx) => {
      if (block.kind === 'heading') {
        return (
          <h2
            key={idx}
            className="text-lg font-semibold text-ink pt-3 first:pt-0 tracking-tight"
          >
            {block.text}
          </h2>
        );
      }

      if (block.kind === 'text') {
        return (
          <p key={idx} className="text-sm text-ink/75 leading-relaxed">
            {block.text}
          </p>
        );
      }

      if (block.kind === 'list') {
        return (
          <ul key={idx} className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-ink/75 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-sky shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      if (block.kind === 'table') {
        return (
          <div key={idx} className="border border-line rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[520px]">
                <thead>
                  <tr className="bg-surface-soft text-left">
                    {block.headers.map((header, i) => (
                      <th
                        key={i}
                        className="px-3 py-2.5 font-medium text-ink/60 align-bottom"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-3 py-2.5 ${
                            cIdx === 0 ? 'font-semibold text-ink' : 'text-ink/75'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      // Одиночная иллюстрация в сетке из трёх смотрелась бы огрызком рядом
      // с двумя пустыми колонками, поэтому её показываем отдельно и не шире 420px.
      const alone = block.images.length === 1;

      return (
        <div
          key={idx}
          className={alone ? '' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'}
        >
          {block.images.map((src) => (
            <button
              key={src}
              onClick={() => onImageClick(src)}
              className={`aspect-4/3 flex items-center justify-center border border-line rounded-xl overflow-hidden bg-white hover:border-brand-sky transition-colors cursor-zoom-in ${
                alone ? 'w-full max-w-[420px]' : ''
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      );
    })}
  </div>
);
