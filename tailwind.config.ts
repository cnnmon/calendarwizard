import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-color': 'var(--dark)',
        'background-color': 'var(--background)',
        'light-color': 'var(--light)',
      },
    },
  },
  plugins: [],
} satisfies Config;
