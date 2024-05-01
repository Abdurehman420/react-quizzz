/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        neo: "20px 20px 0 #000",
        neoButton: "4px 4px 0 1px #000",
      },
    },
  },
  plugins: [],
};
