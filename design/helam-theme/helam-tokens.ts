/**
 * Helam Club design tokens.
 * A calm, breathing, RTL-first palette built around deep navy,
 * steel blue and a warm amber accent.
 */
export function helamTokens() {
  const tokens = {
    /**
     * background color. used for the primary app surface.
     */
    backgroundColor: '#F6F8FA',

    /**
     * Color Palette
     */
    colors: {
      primary: {
        default: '#0B1A30', // deep navy — headers, top bar, dark backgrounds
        hover: '#12294A',
        active: '#081422',
      },
      secondary: {
        default: '#4F6D7A', // steel blue — subheads, supporting elements, dividers
        hover: '#5C7D8C',
        active: '#405B67',
      },
      accent: {
        default: '#E89F4B', // amber — CTAs, rating stars, active highlights
        hover: '#EEB06B',
        active: '#D1863A',
      },
      surface: {
        background: '#F6F8FA', // default page background
        primary: '#FFFFFF', // primary content surface (cards)
        secondary: '#EDF1F4', // alternate/soft surface
      },
      text: {
        primary: '#1A1A1A', // main text color
        default: '#1A1A1A',
        secondary: '#5C6B76', // secondary/supporting text
        inverse: '#FFFFFF', // text on dark backgrounds
        muted: '#5C6B76', // muted/caption text
      },
      status: {
        positive: { default: '#2EA06E', subtle: '#D9F0E4' },
        negative: { default: '#D64545', subtle: '#F8D9D9' },
        warning: { default: '#E89F4B', subtle: '#FBE6CD' },
        info: { default: '#4F6D7A', subtle: '#E1E8EB' },
      },
      overlay: 'rgba(11, 26, 48, 0.55)',
      border: '#DDE4E9',
      star: '#E89F4B',
      white: '#FFFFFF',
      black: '#1A1A1A',
    },

    borders: {
      default: {
        color: '#DDE4E9',
        width: '1px',
        style: 'solid',
      },
      focus: {
        color: '#E89F4B',
        width: '2px',
        style: 'solid',
        offset: '2px',
      },
      radius: {
        small: '8px',
        medium: '14px',
        large: '22px',
        pill: '999px',
      },
    },

    /**
     * Typography System
     */
    typography: {
      fontFamily: "'Assistant', 'Rubik', sans-serif",
      sizes: {
        display: { large: '48px', medium: '40px', small: '32px' },
        heading: {
          h1: '36px',
          h2: '24px',
          h3: '20px',
          h4: '18px',
          h5: '16px',
          h6: '14px',
        },
        subhead: '18px',
        body: { large: '16px', medium: '15px', default: '14px', small: '13px' },
        caption: { default: '12px', medium: '13px' },
      },
      lineHeight: {
        base: '1.6',
        heading: '1.2',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.03em',
      },
    },

    /**
     * Spacing & Layout
     */
    spacing: {
      default: '12px',
      small: '8px',
      medium: '16px',
      large: '24px',
      xl: '32px',
      x4: '48px',
    },

    layout: {
      /**
       * Maximum width size for pages
       */
      maxPageWidth: '1180px',

      /**
       * Spacing between columns or elements
       */
      gutter: '20px',

      /**
       * default reading direction for the Helam Club product (RTL first).
       */
      direction: 'rtl',
    },

    /**
     * Visual Effects
     */
    effects: {
      shadows: {
        xs: '0 1px 2px rgba(11, 26, 48, 0.06)',
        small: '0 2px 6px rgba(11, 26, 48, 0.08)',
        medium: '0 4px 12px rgba(11, 26, 48, 0.1)',
        large: '0 8px 20px rgba(11, 26, 48, 0.14)',
        xLarge: '0 16px 32px rgba(11, 26, 48, 0.18)',
        inset: 'inset 0 1px 2px rgba(11, 26, 48, 0.08)',
        raised: '0 4px 12px rgba(11, 26, 48, 0.12), 0 2px 4px rgba(11, 26, 48, 0.08)',
        card: '0 2px 10px rgba(11, 26, 48, 0.06)',
        cardHover: '0 8px 24px rgba(11, 26, 48, 0.12)',
        header: '0 2px 12px rgba(11, 26, 48, 0.18)',
      },
      opacity: { disabled: '0.5', hover: '0.85', faint: '0.28', semiOpaque: '0.7' },
      gradients: {
        primary: 'linear-gradient(160deg, #0B1A30 0%, #12294A 100%)',
        secondary: 'linear-gradient(180deg, #EDF1F4 0%, #F6F8FA 100%)',
        radial: 'radial-gradient(circle, #4F6D7A, #0B1A30)',
      },
      blur: {
        small: 'blur(4px)',
        medium: 'blur(8px)',
        large: 'blur(16px)',
      },
    },

    /**
     * Interaction & Motion
     */
    interactions: {
      cursor: { pointer: 'pointer', disabled: 'not-allowed', text: 'text', grab: 'grab', grabbing: 'grabbing' },
      zIndex: { base: '1', modal: '100', tooltip: '200', overlay: '300', sticky: '50' },
      gradients: {
        primary: 'linear-gradient(135deg, #E89F4B, #D1863A)',
        secondary: 'linear-gradient(135deg, #4F6D7A, #0B1A30)',
        subtle: 'linear-gradient(to bottom, rgba(246, 248, 250, 0.85), rgba(237, 241, 244, 0.6))',
        codeBlock: 'linear-gradient(to right, rgba(246, 248, 250, 1), rgba(237, 241, 244, 1))',
      },
      transitions: {
        duration: { fast: '0.15s', medium: '0.3s', slow: '0.5s', verySlow: '1s' },
        easing: {
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeOut: 'ease-out',
          easeIn: 'ease-in',
          spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        },
        property: {
          all: 'all',
          transform: 'transform',
          opacity: 'opacity',
          color: 'color',
          shadow: 'box-shadow',
        },
      },
      hoverEffect: {
        scale: 'scale(1.02)',
        translateY: 'translateY(-3px)',
        shadow: '0 8px 24px rgba(11, 26, 48, 0.12)',
      },
    },
  };

  return tokens;
}

// create a theme type schema to allow new theme variations to override
// or implement a different theme variation like a dark theme.
/**
 * Use tokens from this schema as css variables in your components.
 * For example, use `colors.primary.default` as css variable `--colors-primary-default`
 */
export type HelamThemeSchema = ReturnType<typeof helamTokens>;
