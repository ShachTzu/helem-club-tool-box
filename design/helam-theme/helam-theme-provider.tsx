import { createTheme } from '@bitdesign/sparks.sparks-theme';
import { HelamThemeSchema, helamTokens } from './helam-tokens.js';

/**
 * creating and declaring the Helam Club theme.
 * define the theme schema as a type variable for proper type completions.
 */
export const HelamThemeProvider = createTheme<HelamThemeSchema>({
  tokens: helamTokens,
});

/**
 * a react hook for contextual access to design tokens
 * from components.
 */
export const { useTheme } = HelamThemeProvider;
