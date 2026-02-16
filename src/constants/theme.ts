// Healthcare Portal Theme Configuration
export const colors = {
  // Primary Colors
  primary: "#00D563",
  primaryLight: "#C8F5DD",
  primaryDark: "#00B854",

  // Background Colors
  background: "#F5F5F5",
  white: "#FFFFFF",

  // Text Colors
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  textLight: "#9CA3AF",

  // Border Colors
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Status Colors
  error: "#EF4444",
  success: "#00D563",
  warning: "#F59E0B",
  info: "#3B82F6",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const typography = {
  // Font Sizes
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

  // Font Weights
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
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
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
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
