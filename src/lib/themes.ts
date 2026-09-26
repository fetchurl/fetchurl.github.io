/** DaisyUI theme ids. Names must match the theme plugins in src/styles/global.css. */
export const themeStorageKey = 'fetchurl-theme';

export const themes = [
  { id: 'fetchurl', label: 'Light', color: '#0050d0' },
  { id: 'fetchurl-dark', label: 'Dark', color: '#121826' },
] as const;

export type ThemeId = (typeof themes)[number]['id'];

export const defaultThemeId: ThemeId = themes[0].id;
export const darkThemeId: ThemeId = themes[1].id;

export const themeColors: Record<ThemeId, string> = Object.fromEntries(
  themes.map((theme) => [theme.id, theme.color]),
) as Record<ThemeId, string>;
