/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        iron: {
          950: '#0a0d14',
          900: '#0f1420',
          850: '#141b2b',
          800: '#1a2338',
          750: '#212d47',
          700: '#2c3b5d',
          600: '#3d517e',
          500: '#526b9e',
          400: '#8ba1cb',
          300: '#c2d0eb',
          200: '#e2e8f0',
          100: '#f8fafc',
        },
        motor: {
          blue: '#0284c7',
          sky: '#38bdf8',
          teal: '#0d9488',
        },
        status: {
          normal: '#10b981',      // Green -> Normal
          attention: '#f59e0b',   // Amber -> Attention
          critical: '#ef4444',    // Red -> Critical
          info: '#38bdf8',        // Blue -> Information / Power
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        display: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        'industrial-sm': '0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'industrial-md': '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glow-green': '0 0 16px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 16px rgba(245, 158, 11, 0.3)',
        'glow-red': '0 0 16px rgba(239, 68, 68, 0.35)',
        'glow-blue': '0 0 16px rgba(56, 189, 248, 0.25)',
      },
    },
  },
  plugins: [],
}
