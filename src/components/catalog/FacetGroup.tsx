import React from 'react';
import { FilterBlock } from './FilterBlock';
import { FacetList } from './FacetList';

/** Признак свёрнутым блоком — для выдвижной панели на телефоне. */
export const FacetGroup: React.FC<{
  title: string;
  options: [string, number][];
  selected: string[];
  onToggle: (value: string) => void;
  preview?: number;
}> = ({ title, options, selected, onToggle, preview = 8 }) => {
  if (!options.length) return null;

  return (
    <FilterBlock title={title} count={selected.length} defaultOpen={selected.length > 0}>
      <FacetList
        title={title}
        options={options}
        selected={selected}
        onToggle={onToggle}
        preview={preview}
      />
    </FilterBlock>
  );
};
