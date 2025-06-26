/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "black",
        secondary: "#151312",
        light: {
          100: "#D6C6FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#1A1A1A",
          200: "#0D0D0D",
          300: "#030014",
        },
        accent: {
          100: "#FFB6C1",
          200: "#FF69B4",
          300: "#FF1493",
        },
        error: "#FF0000",
        success: "#00FF00",
        warning: "#FFA500",
        info: "#0000FF",
      },
    },
  },
  plugins: [],
};
