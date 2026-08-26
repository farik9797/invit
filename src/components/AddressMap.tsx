import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

/*
 * Карта адреса на OpenStreetMap.
 *
 * Взят именно OSM, а не Яндекс или Google: их встраиваемые карты ставят свои
 * cookie, а в политике конфиденциальности у нас написано, что сайт этого не
 * делает. OSM обходится без ключа и без рекламных счётчиков — грузятся только
 * тайлы карты.
 *
 * Координаты найдены геокодером по адресам клиента, а не поставлены на глаз:
 * ТЦ «Сеница» — 53.8357, 27.5052; Солигорск, Строителей 30 — 52.7942, 27.5370.
 * Если адрес поменяется, координаты надо пересчитать, иначе метка встанет мимо.
 */

interface AddressMapProps {
  lat: number;
  lon: number;
  /** Что показать под картой. */
  title: string;
  address: string;
  /** Насколько широкий кусок карты показывать: меньше — крупнее. */
  span?: number;
  className?: string;
}

export const AddressMap: React.FC<AddressMapProps> = ({
  lat,
  lon,
  title,
  address,
  span = 0.008,
  className = ''
}) => {
  const bbox = [lon - span, lat - span / 2, lon + span, lat + span / 2].join(',');
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const full = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=17/${lat}/${lon}`;

  return (
    <div className={`rounded-[8px] border border-inv-border bg-white overflow-hidden ${className}`}>
      <iframe
        src={embed}
        title={`Карта: ${title}`}
        loading="lazy"
        className="w-full h-[220px] sm:h-[280px] border-0"
      />

      <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-t border-inv-border">
        <span className="flex gap-2.5 min-w-0">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-inv-blue" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-inv-ink">{title}</span>
            <span className="block mt-0.5 text-sm text-inv-ink-muted">{address}</span>
          </span>
        </span>

        <a
          href={full}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-11 sm:min-h-0 text-sm font-semibold text-inv-blue hover:text-inv-blue-pressed transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-blue"
        >
          Открыть карту
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

/**
 * Координаты офисов — одни на все страницы. Найдены геокодером по адресам
 * клиента: ТЦ «Сеница» на 23-м километре МКАД и дом 30 по улице Строителей
 * в Солигорске.
 */
export const OFFICE_COORDS = {
  minsk: { lat: 53.8356976, lon: 27.5052139 },
  soligorsk: { lat: 52.7942092, lon: 27.5370123 }
};
