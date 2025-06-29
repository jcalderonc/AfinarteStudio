// AfinarteStudio Color Palette
// Extracted from logo.png
// TypeScript color constants for Angular components

export const COLORS = {
  // Primary Brand Colors
  PRIMARY_GOLD: '#e4a323',
  PRIMARY_GOLD_LIGHT: '#ffb625',
  PRIMARY_GOLD_DARK: '#d4921f',
  
  // Secondary Colors
  SECONDARY_DARK: '#1a1a1a',
  SECONDARY_DARK_ALT: '#2b2725',
  SECONDARY_LIGHT: '#f9f9f9',
  SECONDARY_GRAY: '#9c9c9c',
  
  // Background Colors
  BG_PRIMARY: '#1a1a1a',
  BG_SECONDARY: '#f9f9f9',
  BG_WHITE: '#ffffff',
  
  // Text Colors
  TEXT_PRIMARY: '#f9f9f9',
  TEXT_SECONDARY: '#1a1a1a',
  TEXT_MUTED: '#9c9c9c',
  TEXT_ACCENT: '#e4a323',
  
  // Interactive States
  HOVER_GOLD: '#f5b837',
  ACTIVE_GOLD: '#d09112',
  FOCUS_GOLD: '#e4a323',
  
  // Border Colors
  BORDER_LIGHT: '#9c9c9c',
  BORDER_DARK: '#2b2725',
  BORDER_ACCENT: '#e4a323',
  
  // Shadow Colors
  SHADOW_LIGHT: 'rgba(0, 0, 0, 0.1)',
  SHADOW_MEDIUM: 'rgba(0, 0, 0, 0.25)',
  SHADOW_DARK: 'rgba(0, 0, 0, 0.5)',
  SHADOW_GOLD: 'rgba(228, 163, 35, 0.3)',
} as const;

export const GRADIENTS = {
  GOLD: 'linear-gradient(to bottom, #ffb625, #ffffff)',
  GOLD_ALT: 'linear-gradient(to bottom, #e4a323, #ffffff)',
  LIGHT: 'linear-gradient(to bottom, #ffffff, rgba(43, 39, 37, 0))',
} as const;

// Color utility functions
export const colorUtils = {
  hexToRgba: (hex: string, alpha: number = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  getGoldWithOpacity: (opacity: number) => 
    colorUtils.hexToRgba(COLORS.PRIMARY_GOLD, opacity),
  
  getDarkWithOpacity: (opacity: number) => 
    colorUtils.hexToRgba(COLORS.SECONDARY_DARK, opacity),
};

// Export individual color groups for easier imports
export const primaryColors = {
  gold: COLORS.PRIMARY_GOLD,
  goldLight: COLORS.PRIMARY_GOLD_LIGHT,
  goldDark: COLORS.PRIMARY_GOLD_DARK,
};

export const neutralColors = {
  dark: COLORS.SECONDARY_DARK,
  darkAlt: COLORS.SECONDARY_DARK_ALT,
  light: COLORS.SECONDARY_LIGHT,
  gray: COLORS.SECONDARY_GRAY,
  white: COLORS.BG_WHITE,
};

export const textColors = {
  primary: COLORS.TEXT_PRIMARY,
  secondary: COLORS.TEXT_SECONDARY,
  muted: COLORS.TEXT_MUTED,
  accent: COLORS.TEXT_ACCENT,
};
