// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Strict Professional Palette
        dairyRed: "#C8102E",    // Professional True Red for Accents/Buttons
        dairyBlack: "#1A1A1A",  // Deep black for all text
      },
      fontFamily: {
        fraunces: ["Fraunces", "serif"],
        dmsans: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 20px 40px -10px rgba(0, 0, 0, 0.1)', 
        'redGlow': '0 10px 25px -5px rgba(200, 16, 46, 0.3)', 
      }
    },
  },
  plugins: [],
}