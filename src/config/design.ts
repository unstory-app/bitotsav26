export const DESIGN_SYSTEM = {
  colors: {
    background: "#1A0505",
    foreground: "#FDF5E6",
    primary: "#D4AF37", // "Heritage Gold"
    secondary: "#3D0A0A",
    accent: "#FFD700",
    muted: "#2D0F0F",
    border: "rgba(212, 175, 55, 0.2)",
  },
  fonts: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  transitions: {
    default: { duration: 0.5, ease: [0.65, 0.05, 0, 1] },
    spring: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export type DesignSystem = typeof DESIGN_SYSTEM;
