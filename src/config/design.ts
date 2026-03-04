export const DESIGN_SYSTEM = {
  colors: {
    background: "#050505",
    foreground: "#ffffff",
    primary: "#DFFF00", // "Concert Yellow" / Neon Yellow
    secondary: "#1A1A1A",
    accent: "#E2FF00",
    muted: "#404040",
    border: "rgba(255, 255, 255, 0.1)",
  },
  fonts: {
    heading: "var(--font-heading)",
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  transitions: {
    default: { duration: 0.5, ease: [0.65, 0.05, 0, 1] },
    spring: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export type DesignSystem = typeof DESIGN_SYSTEM;
