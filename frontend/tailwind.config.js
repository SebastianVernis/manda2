/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manda2-dark': '#1a1a1a',
        'manda2-silver': '#c0c0c0',
        'manda2-gray': '#404040',
        'manda2-light-gray': '#666666',
        'manda2-accent': '#ffffff',
      },
      backgroundImage: {
        'gradient-manda2': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)',
        'gradient-silver': 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)',
        'gradient-dark': 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      },
      fontFamily: {
        'manda2': ['Inter', 'system-ui', 'sans-serif'],
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
  plugins: [],
}