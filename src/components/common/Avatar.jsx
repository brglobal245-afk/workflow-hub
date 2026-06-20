import React from 'react';

const COLOR_MAP = {
  blue:   { bg: '#dbeafe', color: '#1d4ed8' },
  green:  { bg: '#dcfce7', color: '#15803d' },
  purple: { bg: '#ede9fe', color: '#6d28d9' },
  orange: { bg: '#ffedd5', color: '#c2410c' },
  pink:   { bg: '#fce7f3', color: '#be185d' },
  teal:   { bg: '#ccfbf1', color: '#0f766e' },
  red:    { bg: '#fee2e2', color: '#b91c1c' },
  yellow: { bg: '#fef3c7', color: '#b45309' },
  indigo: { bg: '#e0e7ff', color: '#4338ca' },
  gray:   { bg: '#f1f5f9', color: '#475569' },
};

const SIZE_MAP = {
  xs:  { w: 24,  h: 24,  fontSize: '0.625rem' },
  sm:  { w: 32,  h: 32,  fontSize: '0.75rem' },
  md:  { w: 40,  h: 40,  fontSize: '0.875rem' },
  lg:  { w: 48,  h: 48,  fontSize: '1rem' },
  xl:  { w: 64,  h: 64,  fontSize: '1.25rem' },
  '2xl': { w: 80, h: 80, fontSize: '1.5rem' },
  '3xl': { w: 96, h: 96, fontSize: '1.75rem' },
};

export default function Avatar({ name, src, color = 'blue', size = 'md', style = {} }) {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  const c = COLOR_MAP[color] || COLOR_MAP.blue;
  const initials = name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div
      style={{
        width: s.w, height: s.h, minWidth: s.w,
        borderRadius: '50%',
        background: c.bg,
        color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: s.fontSize, fontWeight: 700,
        overflow: 'hidden', userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}
