import React from 'react';
import { ContentBlock } from '../types';

interface Props {
  blocks: ContentBlock[];
  onImageClick: (src: string) => void;
}

/** Описание товара как на invit.by: заголовки, абзацы, списки, таблицы и иллюстрации. */
export const ProductContentBlocks: React.FC<Props> = ({ blocks, onImageClick }) => (
  <div className="space-y-5">
    {blocks.map((block, idx) => {
      if (block.kind === 'heading') {
        return (
          <h2
            key={idx}
            className="text-lg font-semibold text-brand-navy pt-3 first:pt-0 tracking-tight"
          >
            {block.text}
          </h2>
        );
      }

      if (block.kind === 'text') {
        return (
          <p key={idx} className="text-sm text-brand-navy/75 leading-relaxed">
            {block.text}
          </p>
        );
      }

      if (block.kind === 'list') {
        return (
          <ul key={idx} className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-brand-navy/75 leading-relaxed">
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
                        className="px-3 py-2.5 font-medium text-brand-navy/60 align-bottom"
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
                            cIdx === 0 ? 'font-semibold text-brand-navy' : 'text-brand-navy/75'
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

      return (
        <button
          key={idx}
          onClick={() => onImageClick(block.src)}
          className="block w-full border border-line rounded-xl overflow-hidden bg-white hover:border-brand-sky transition-colors cursor-zoom-in"
        >
          <img src={block.src} alt="" loading="lazy" className="w-full h-auto" />
        </button>
      );
    })}
  </div>
);
