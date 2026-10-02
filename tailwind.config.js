/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,jsx,mdx}",
    "./src/app/**/*.{js,jsx,mdx}",
  ],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1320px" } },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ink: { DEFAULT: "#111111", soft: "#2b2b2b" },
        surface: { DEFAULT: "#f5f5f5", strong: "#ececec" },
        brand: { DEFAULT: "#ff5a1f", dark: "#c2410c", soft: "#fff1ea" },
        sale: "#c62f12",
        success: { DEFAULT: "#15803d", soft: "#ecfdf3" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,17,17,.04), 0 8px 24px -12px rgba(17,17,17,.12)",
        pop: "0 12px 40px -12px rgba(17,17,17,.28)",
      },
      keyframes: {
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "slide-in-left": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        "fade-up": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "slide-in-right": "slide-in-right .28s cubic-bezier(.32,.72,0,1)",
        "slide-in-left": "slide-in-left .28s cubic-bezier(.32,.72,0,1)",
        "fade-up": "fade-up .4s ease-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
