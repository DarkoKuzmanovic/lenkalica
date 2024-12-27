import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FFB800", // Sunflower yellow
          "primary-content": "#1A1600", // Dark brown for contrast
          secondary: "#4A5900", // Sunflower stem green
          "secondary-content": "#ECFCCB", // Light green
          accent: "#FF8A00", // Warm orange
          "accent-content": "#1A0F00", // Dark brown
          neutral: "#2A2A2A", // Dark gray
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F8F8F8",
          "base-300": "#EEEEEE",
          "base-content": "#2A2A2A",
          info: "#3B82F6",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        dark: {
          primary: "#FFB800", // Sunflower yellow
          "primary-content": "#1A1600", // Dark brown
          secondary: "#4A5900", // Sunflower stem green
          "secondary-content": "#ECFCCB", // Light green
          accent: "#FF8A00", // Warm orange
          "accent-content": "#1A0F00", // Dark brown
          neutral: "#2A2A2A", // Dark gray
          "neutral-content": "#FFFFFF",
          "base-100": "#1A1A1A", // Dark background
          "base-200": "#242424",
          "base-300": "#2E2E2E",
          "base-content": "#EEEEEE",
          info: "#3B82F6",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
    ],
  },
};

export default config;
