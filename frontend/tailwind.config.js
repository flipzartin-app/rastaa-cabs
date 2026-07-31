/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        road: "#12141C",
        roadline: "#1D2030",
        taxi: "#F4C430",
        "taxi-dark": "#D9A916",
        meter: "#35D07F",
        paper: "#F6F3EA",
        steel: "#8B93A7",
        alert: "#E5484D",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "dash-line":
          "repeating-linear-gradient(90deg, #F4C430 0px, #F4C430 24px, transparent 24px, transparent 44px)",
      },
    },
  },
  plugins: [],
};
