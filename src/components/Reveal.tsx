import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  /** Задержка внутри группы — для лесенки в сетках. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Появление блока при прокрутке: лёгкий подъём и проявление, один раз.
 * При включённом «уменьшить движение» анимация не запускается.
 */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className, as = 'div' }) => {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
};

/** Обёртка для сеток: дети появляются лесенкой. */
export const RevealGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  step?: number;
}> = ({ children, className, step = 0.07 }) => (
  <div className={className}>
    {React.Children.map(children, (child, idx) => (
      <Reveal delay={Math.min(idx * step, 0.4)}>{child}</Reveal>
    ))}
  </div>
);
