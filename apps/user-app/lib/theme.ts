export type GenderTheme = "Male" | "Female" | "default";

export const THEME_MAP = {
  Male: {
    pageBg: "bg-blue-50",
    accent: "bg-blue-500",
    accentText: "text-blue-600",
  },

  Female: {
    pageBg: "bg-pink-50",
    accent: "bg-pink-500",
    accentText: "text-pink-600",
  },

  default: {
    pageBg: "bg-white",
    accent: "bg-gray-800",
    accentText: "text-gray-900",
  },
};
