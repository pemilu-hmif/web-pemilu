import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        playfair: ["var(--font-playfair)"],
        sloop: ["var(--font-sloop)"],
        satoshi: ["var(--font-satoshi)"],
        neuething: ["var(--font-neuething)"],
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
} satisfies Config;
