// SangRoot Medical Theme – Orange Palette
export const colors = {
  // Primary Brand
  primary: "#FF5722",
  primaryDark: "#D84315",
  primaryLight: "#FFCCBC",

  // Status
  alertRed: "#F44336",
  successGreen: "#4CAF50",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Neutrals
  neutralGray: "#607D8B",
  lightGray: "#F5F5F5",
  darkGray: "#455A64",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Background
  background: "#F5F5F5",
  white: "#FFFFFF",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#607D8B",
  textLight: "#9CA3AF",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

export const typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
    "4xl": 32,
  },
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
