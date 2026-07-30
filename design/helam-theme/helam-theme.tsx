import { type ReactNode, useCallback, useState } from 'react';
import classNames from 'classnames';
import { mergeTokenSchema, type DeepPartial } from '@bitdesign/sparks.sparks-theme';
import { HelamThemeProvider } from './helam-theme-provider.js';
import { HelamThemeSchema } from './helam-tokens.js';
import { ThemeContext, type ThemeContextValue, type ThemeMode } from './theme-controller.js';
import { themeOptions } from './theme-options.js';
import styles from './helam-theme.module.scss';

export type HelamThemeProps = {
  /**
   * a root ReactNode for the component tree
   * applied with the theme.
   */
  children?: ReactNode;

  /**
   * inject a class name to override to the theme.
   * this allows people to affect your theme. remove to avoid.
   */
  className?: string;

  /**
   * override tokens in the schema
   */
  overrides?: DeepPartial<HelamThemeSchema>;

  /**
   * preset of the theme.
   */
  initialTheme?: ThemeMode;

  /**
   * style tags to include.
   */
  style?: React.CSSProperties;
};

/**
 * the Helam Club theme.
 * provides the design tokens, fonts, RTL layout direction and general
 * styling for the Helam Club ecosystem of components.
 */
export function HelamTheme({ children, initialTheme, overrides, className, style }: HelamThemeProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialTheme || 'light');

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeModeState((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const themeContextValue: ThemeContextValue = {
    themeMode,
    toggleTheme,
    setThemeMode,
  };

  const themePreset = themeMode === 'dark' ? themeOptions.dark : undefined;
  const themeOverrides = mergeTokenSchema(themePreset || {}, overrides || {});

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <HelamThemeProvider.ThemeProvider
        dir="rtl"
        className={classNames(styles.helamTheme, className)}
        overrides={themeOverrides}
        style={style}
      >
        {children}
      </HelamThemeProvider.ThemeProvider>
    </ThemeContext.Provider>
  );
}
