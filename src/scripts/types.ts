export const Status = {
  released: 'released',
  developing: 'developing',
  closed: 'closed',
  unknown: 'unknown',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

/**
 * Please refer to the /src/content.config.ts if you want to make
 * any changes to any collectio names
 */
export const Collection = {
  blog: 'blog',
  frontendProjects: 'frontendProjects',
  guides: 'guides',
} as const;

export type Collection = (typeof Collection)[keyof typeof Collection];

export const btnVariant = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
} as const;

export type btnVariant = (typeof btnVariant)[keyof typeof btnVariant];

export const btnStyle = {
  button: 'button',
  simple: 'simple',
} as const;

export type btnStyle = (typeof btnStyle)[keyof typeof btnStyle];

export const btnIconPos = {
  right: 'right',
  left: 'left',
} as const;

export type btnIconPos = (typeof btnIconPos)[keyof typeof btnIconPos];

export const ColorScheme = {
  dark: 'dark',
  light: 'light',
} as const;

export type ColorScheme = (typeof ColorScheme)[keyof typeof ColorScheme];

export const Theme = {
  default: 'default',
  catppuccin: 'catppuccin',
} as const;

export type Theme = (typeof Theme)[keyof typeof Theme];
