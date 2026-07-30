import { theme } from './theme.js';

/**
 * Renders a 1–5 star rating row. Supports fractional averages via a clipped overlay.
 * @param value average rating (0–5)
 * @param size star font-size in px
 */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', fontSize: size, lineHeight: 1, direction: 'ltr' }}
      aria-label={`דירוג ${value} מתוך 5`}
    >
      <span style={{ color: theme.color.border }}>★★★★★</span>
      <span
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${pct}%`,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          color: theme.color.star,
        }}
      >
        ★★★★★
      </span>
    </span>
  );
}
