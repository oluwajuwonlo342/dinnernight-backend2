/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        onyx: {
          950: '#08080a',
          900: '#0d0d10',
          800: '#141417',
          700: '#1d1d22',
          600: '#2a2a31',
        },
        gold: {
          50: '#fdf8ec',
          100: '#faeec9',
          200: '#f3d98d',
          300: '#eabf51',
          400: '#e2a92f',
          500: '#cc8f1e',
          600: '#a86f18',
          700: '#805218',
          800: '#6b431a',
          400: '#e2a92f',
        },
        ivory: '#faf8f3',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'spotlight': 'radial-gradient(circle at 50% 0%, rgba(226,169,47,0.18), rgba(8,8,10,0) 60%)',
        'gold-gradient': 'linear-gradient(135deg, #f3d98d 0%, #e2a92f 45%, #a86f18 100%)',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(226,169,47,0.4), 0 8px 30px -8px rgba(226,169,47,0.35)',
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
