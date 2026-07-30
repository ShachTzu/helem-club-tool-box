import { DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { HelamThemeSchema } from './helam-tokens.js';

/**
 * override tokens for the dark theme variation.
 * overrides the default Helam Club light theme tokens.
 */
export const darkThemeSchema: DeepPartial<HelamThemeSchema> = {
  backgroundColor: '#0B1A30',
  colors: {
    primary: {
      default: '#12294A',
      hover: '#1A3B66',
      active: '#0B1A30',
    },
    secondary: {
      default: '#5C7D8C',
      hover: '#6F909F',
      active: '#4F6D7A',
    },
    accent: {
      default: '#E89F4B',
      hover: '#EEB06B',
      active: '#D1863A',
    },
    surface: {
      background: '#0B1A30',
      primary: '#12294A',
      secondary: '#152F52',
    },
    text: {
      primary: '#F6F8FA',
      default: '#F6F8FA',
      secondary: '#B7C3CC',
      inverse: '#0B1A30',
      muted: '#8FA0AA',
    },
    status: {
      positive: { default: '#3FBF8A', subtle: '#173C2E' },
      negative: { default: '#E36767', subtle: '#3C1717' },
      warning: { default: '#E89F4B', subtle: '#3C2A12' },
      info: { default: '#7C97A3', subtle: '#1B2C36' },
    },
    overlay: 'rgba(0, 0, 0, 0.65)',
    border: '#2B3C4D',
    star: '#E89F4B',
    white: '#FFFFFF',
    black: '#1A1A1A',
  },
  borders: {
    default: {
      color: '#2B3C4D',
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
};
