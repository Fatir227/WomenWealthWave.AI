declare module 'next-themes' {
  import * as React from 'react';

  type Theme = 'light' | 'dark' | 'system';

  interface ThemeProviderProps {
    children: React.ReactNode;
    /**
     * Default theme
     * @default 'system'
     */
    defaultTheme?: Theme;
    /**
     * HTML attribute modified based on the active theme
     * @default 'class'
     */
    attribute?: string | 'class';
    /**
     * Whether to enable system theme detection
     * @default true
     */
    enableSystem?: boolean;
    /**
     * Disable all CSS transitions when switching themes
     * @default false
     */
    disableTransitionOnChange?: boolean;
    /**
     * Key used to store theme setting in localStorage
     * @default 'theme'
     */
    storageKey?: string;
    /**
     * Nonce string to pass to the inline script for CSP headers
     */
    nonce?: string;
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
  export function useTheme(): {
    theme: string | undefined;
    setTheme: (theme: string) => void;
    themes: Theme[];
  };

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export default ThemeProvider;
}
