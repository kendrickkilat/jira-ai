/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "960px",
      lg: "1440px",
      xl: "1897px",
    },
    lineHeight: {
      none: "1",
      tight: "1.2",
      normal: "1.5",
      auto: "auto",
    },
    fontSize: ({ theme }) => ({
      h1: [
        "35px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      h2: [
        "28px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      h3: [
        "24px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      h4: [
        "21px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      h5: [
        "17px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      h6: [
        "14px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
      small: [
        "16px",
        {
          lineHeight: theme("lineHeight.normal"),
        },
      ],
    }),
    fontWeight: {
      regular: "400",
      semibold: "600",
      bold: "700",
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        dylan: ["Dylan"],
      },
      colors: {
        gunmetal: {
          50: "#eaeaeb",
          100: "#dfe0e1",
          200: "#bcbec1",
          300: "#282d38",
          400: "#242932",
          500: "#20242d",
          600: "#1e222a",
          700: "#181b22",
          800: "#121419",
          900: "#0e1014",
        },
        cadet: {
          50: "#eff6f7",
          100: "#e7f2f3",
          200: "#cde4e6",
          300: "#5da7af",
          400: "#54969e",
          500: "#4a868c",
          600: "#467d83",
          700: "#386469",
          800: "#2a4b4f",
          900: "#213a3d",
        },
        silver: {
          50: "#f5f7f7",
          100: "#f0f3f3",
          200: "#e1e5e6",
          300: "#9dacad",
          400: "#8d9b9c",
          500: "#7e8a8a",
          600: "#768182",
          700: "#5e6768",
          800: "#474d4e",
          900: "#373c3d",
        },
        turquoise: {
          50: "#f5faf7",
          100: "#f0f8f3",
          200: "#e0f0e7",
          300: "#9acfb0",
          400: "#8bba9e",
          500: "#7ba68d",
          600: "#749b84",
          700: "#5c7c6a",
          800: "#455d4f",
          900: "#36483e",
        },
        sizzle: {
          50: "#fdefef",
          100: "#fce7e8",
          200: "#f9cccf",
          300: "#eb5c63",
          400: "#d45359",
          500: "#bc4a4f",
          600: "#b0454a",
          700: "#8d373b",
          800: "#6a292d",
          900: "#522023",
        },
      },
    },
  },
  plugins: [],
};
