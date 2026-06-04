/* Shared color palettes for light and dark themes */

export const lightColors = {
  surface: '#f9f5ea',
  surfaceContainer: '#d9d7d1',
  surfaceContainerLow: '#f5f3ee',
  surfaceContainerHigh: '#eae8e3',
  surfaceVariant: '#e4e2dd',
  onSurface: '#1b1c19',
  onSurfaceVariant: '#504442',
  primary: '#271310',
  onPrimary: '#ffffff',
  primaryContainer: '#3e2723',
  primaryFixedDim: '#e3beb8',
  secondary: '#895200',
  onSecondary: '#ffffff',
  secondaryContainer: '#feb158',
  secondaryFixed: '#ffdcbc',
  tertiary: '#765b00',
  tertiaryContainer: '#c9a74d',
  outlineVariant: '#d3c3c0',
};

export const darkColors = {
  surface: '#1a1614',
  surfaceContainer: '#252120',
  surfaceContainerLow: '#201c1a',
  surfaceContainerHigh: '#2e2a28',
  surfaceVariant: '#352f2d',
  onSurface: '#ece0dc',
  onSurfaceVariant: '#c4b5b1',
  primary: '#f5ded8',
  onPrimary: '#1a1614',
  primaryContainer: '#e3beb8',
  primaryFixedDim: '#c49e98',
  secondary: '#ffc17a',
  onSecondary: '#1a1614',
  secondaryContainer: '#7a4800',
  secondaryFixed: '#5e3800',
  tertiary: '#d4b45a',
  tertiaryContainer: '#8a6e10',
  outlineVariant: '#4a403d',
};

export function getColors(isDark) {
  return isDark ? darkColors : lightColors;
}
