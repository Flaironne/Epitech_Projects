/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'brown-01': '#483a2e',
        'brown-02': '#fdf7e7',
        'pink-01': '#fed1bc',
      },
      fontFamily: {
        karla: ["Karla", "sans-serif"],
        lato: ["Lato", "sans-serif"],
        lora: ["Lora", "sans-serif"],
        patrick: ["Patrick Hand", "cursive"],
      },
    },
  },
  plugins: [],
};
