/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
        },
        sidebar: {
          DEFAULT: '#0D1425',
          border: 'rgba(255,255,255,0.06)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'sidebar': '4px 0 32px rgba(0,0,0,0.35)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)',
        'blue-sm': '0 2px 8px rgba(37,99,235,0.25)',
        'blue': '0 4px 20px rgba(37,99,235,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'ken-burns': 'kenBurns 18s ease-out both',
        'scene-in': 'sceneIn 0.7s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        // Slow pan/zoom over a still image to give it life (Ken Burns effect).
        kenBurns: {
          from: { transform: 'scale(1.05) translate(0, 0)' },
          to:   { transform: 'scale(1.18) translate(-2.5%, -2%)' },
        },
        // Each new scene fades and lifts into place.
        sceneIn: {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.99)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
