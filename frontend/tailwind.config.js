/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Couleur principale reprise de vos maquettes (boutons "Shop Now", "Sign In"...)
        brand: {
          DEFAULT: "#111827", // bleu marine très foncé / quasi noir
          light: "#1f2937",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Breakpoints Tailwind par défaut, explicités pour la clarté du projet :
      // sm: 640px (mobile large) / md: 768px (tablette) / lg: 1024px (ordinateur) / xl: 1280px
    },
  },
  plugins: [],
};
