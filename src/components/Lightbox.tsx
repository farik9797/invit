import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  index: number | null;
  alt?: string;
  onClose: () => void;
  onChange: (index: number) => void;
}

/** Просмотр фото во весь экран: стрелки, Esc, клик по фону. */
export const Lightbox: React.FC<LightboxProps> = ({ images, index, alt, onClose, onChange }) => {
  useEffect(() => {
    if (index === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose, onChange]);

  if (index === null) return null;

  return (
    <div
      className="fixed inset-0 z-60 bg-brand-navy/95 flex items-center justify-center p-4 sm:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Закрыть"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 sm:left-6 p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % images.length);
            }}
            className="absolute right-3 sm:right-6 p-3 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      <img
        src={images[index]}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain bg-white rounded-lg"
      />

      {images.length > 1 && (
        <span className="absolute bottom-5 text-xs text-white/60">
          {index + 1} / {images.length}
        </span>
      )}
    </div>
  );
};
