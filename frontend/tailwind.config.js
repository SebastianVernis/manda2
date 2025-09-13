import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yega-dark': '#1a1a1a',
        'yega-silver': '#c0c0c0',
        'yega-gray': '#404040',
        'yega-light-gray': '#666666',
        'yega-accent': '#ffffff',
      },
      backgroundImage: {
        'gradient-yega': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
        'gradient-silver': 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      },
      fontFamily: {
        'yega': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: "#c0c0c0",
            foreground: "#000000",
          },
          secondary: {
            DEFAULT: "#666666",
            foreground: "#ffffff",
          },
          success: {
            DEFAULT: "#22c55e",
            foreground: "#ffffff",
          },
          warning: {
            DEFAULT: "#f59e0b",
            foreground: "#ffffff",
          },
          danger: {
            DEFAULT: "#ef4444",
            foreground: "#ffffff",
          },
          background: "#000000",
          foreground: "#ffffff",
        },
      },
    },
  })],
}