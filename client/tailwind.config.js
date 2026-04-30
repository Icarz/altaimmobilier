/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F5',
        clay: {
          50:  '#F4F0EC',
          100: '#E8E2DC',
          200: '#D4CCC4',
          300: '#BDB5AD',
          400: '#A09890',
          500: '#8C8480',
          600: '#736B64',
          700: '#5C5450',
          800: '#3D3735',
          900: '#1A1714',
        },
        terra: {
          50:  '#FBF0EB',
          100: '#F0D9CC',
          200: '#DFB09A',
          300: '#CE8767',
          400: '#BE6135',
          DEFAULT: '#C4622D',
          600: '#A04D22',
          700: '#7D3A18',
        },
        gold: {
          50:  '#F9F4E8',
          100: '#EDE4C3',
          300: '#C5AC50',
          DEFAULT: '#B8963E',
          500: '#9A7D33',
        },
        azure: '#2B5F8E',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(26,23,20,0.08)',
        'card-hover': '0 8px 40px rgba(26,23,20,0.16)',
        warm: '0 10px 50px rgba(26,23,20,0.12)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19,1,0.22,1)',
      },
    },
  },
  plugins: [],
}
