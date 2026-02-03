import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        page: "var(--page-bg)",
        accent: "var(--accent)",
        accentText: "var(--accent-text)",
      },
    },
  },
};

export default config;
