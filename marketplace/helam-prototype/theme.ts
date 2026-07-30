/**
 * Helam Club brand tokens — calm, breathing, RTL-friendly palette.
 * Based on the brand book: deep navy, steel blue, and amber accent.
 */
export const theme = {
  color: {
    primary: '#0B1A30', // deep navy — headers, top bar, dark backgrounds
    secondary: '#4F6D7A', // steel blue — subheads, supporting elements, dividers
    accent: '#E89F4B', // amber — CTAs, rating stars, active highlights (action only)
    black: '#1A1A1A',
    white: '#FFFFFF',
    surface: '#F6F8FA',
    surfaceAlt: '#EDF1F4',
    border: '#DDE4E9',
    textMuted: '#5C6B76',
    star: '#E89F4B',
  },
  radius: {
    sm: '8px',
    md: '14px',
    lg: '22px',
    pill: '999px',
  },
  shadow: {
    card: '0 2px 10px rgba(11, 26, 48, 0.06)',
    cardHover: '0 8px 24px rgba(11, 26, 48, 0.12)',
    header: '0 2px 12px rgba(11, 26, 48, 0.18)',
  },
  font: {
    family: "'Assistant', 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
} as const;
