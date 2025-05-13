// Design tokens for the SmileyBrooms application
// These values can be referenced throughout the application for consistent styling

export const colors = {
  // Primary brand colors
  primary: {
    50: "#e6f7ff",
    100: "#bae7ff",
    200: "#91d5ff",
    300: "#69c0ff",
    400: "#40a9ff",
    500: "#1890ff", // Main primary color
    600: "#096dd9",
    700: "#0050b3",
    800: "#003a8c",
    900: "#002766",
  },

  // Secondary accent colors
  accent: {
    50: "#fff0f6",
    100: "#ffd6e7",
    200: "#ffadd2",
    300: "#ff85c0",
    400: "#f759ab",
    500: "#eb2f96", // Main accent color
    600: "#c41d7f",
    700: "#9e1068",
    800: "#780650",
    900: "#520339",
  },

  // Success, warning, error states
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",

  // Neutral colors for text, backgrounds, etc.
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e8e8e8",
    300: "#d9d9d9",
    400: "#bfbfbf",
    500: "#8c8c8c",
    600: "#595959",
    700: "#434343",
    800: "#262626",
    900: "#141414",
  },

  // Background colors
  background: {
    light: "#ffffff",
    dark: "#141414",
    highlight: "#f0f7ff",
    card: "#ffffff",
  },

  // Text colors
  text: {
    primary: "#262626",
    secondary: "#595959",
    disabled: "#bfbfbf",
    light: "#ffffff",
  },
}

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: "Poppins, Inter, sans-serif",
    mono: 'Menlo, Monaco, "Courier New", monospace',
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
}

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
}

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  outline: "0 0 0 3px rgba(24, 144, 255, 0.5)",
  none: "none",
}

export const borderRadius = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
}

export const transitions = {
  default: "all 0.3s ease",
  fast: "all 0.15s ease",
  slow: "all 0.5s ease",
}

export const zIndices = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: "auto",
}

// Breakpoints for responsive design
export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

// Animation presets
export const animations = {
  fadeIn: "fadeIn 0.5s ease-out",
  slideUp: "slideUp 0.5s ease-out",
  slideDown: "slideDown 0.5s ease-out",
  slideLeft: "slideLeft 0.5s ease-out",
  slideRight: "slideRight 0.5s ease-out",
  pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  bounce: "bounce 1s infinite",
  spin: "spin 1s linear infinite",
}
