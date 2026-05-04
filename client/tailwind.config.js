/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Palette extracted from brand swatch ──────────────────────────
        // Steel blue-gray: #A5B4BB  |  Warm taupe:  #876B62
        // Dark espresso:   #5A2A15  |  Cream beige: #E0D2C3
        // Gold/mustard:    #B89430  |  Terracotta:  #B5522A
        // ─────────────────────────────────────────────────────────────────
        ivory: '#FAF6F0',
        clay: {
          50:  '#F5EDE4',
          100: '#E8DDD1',
          200: '#D5C8B9',
          300: '#BBA89A',
          400: '#9D8B7C',
          500: '#876B62',  // palette warm taupe
          600: '#6C5248',
          700: '#533D34',
          800: '#5A2A15',  // palette dark espresso
          900: '#2A1208',  // near-black warm brown
        },
        terra: {
          50:  '#F8EDE8',
          100: '#EDCEBB',
          200: '#DAA588',
          300: '#C87E58',
          400: '#BE6338',
          DEFAULT: '#B5522A',  // palette terracotta
          600: '#923F1E',
          700: '#722F14',
        },
        gold: {
          50:  '#F5EDD0',
          100: '#E6D490',
          300: '#C8A838',
          DEFAULT: '#B89430',  // palette gold/mustard
          500: '#967820',
        },
        azure: '#A5B4BB',  // palette steel blue-gray
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 20px rgba(42,18,8,0.08)',
        'card-hover': '0 8px 40px rgba(42,18,8,0.16)',
        warm: '0 10px 50px rgba(42,18,8,0.12)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19,1,0.22,1)',
      },
    },
  },
  plugins: [],
}
