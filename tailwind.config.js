/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JoyJump primary palette
        sky: '#A7D8FF',
        mint: '#B8F2E6',
        peach: '#FFD6A5',
        lavender: '#CDB4DB',
        sun: '#FFF3B0',
        // Secondary
        berry: '#FF8FAB',
        leaf: '#95D5B2',
        ocean: '#74C0FC',
        coral: '#FF9F9F',
        purple: '#B197FC',
        // Reward colors
        gold: '#FFD700',
        sparkle: '#FF70A6',
        star: '#FFE066',
        // World colors
        'math-bg': '#FFF8E7',
        'math-primary': '#F4A261',
        'math-dark': '#E76F51',
        'story-bg': '#F0FFF4',
        'story-primary': '#52B788',
        'story-dark': '#2D6A4F',
        'science-bg': '#E8F4FD',
        'science-primary': '#4895EF',
        'science-dark': '#3A0CA3',
        'discovery-bg': '#FFF0F6',
        'discovery-primary': '#F72585',
        'creativity-bg': '#F3F0FF',
        'creativity-primary': '#7209B7',
      },
      fontFamily: {
        heading: ['Fredoka', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
        button: ['Baloo 2', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'star-burst': 'starBurst 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        starBurst: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1.5) rotate(180deg)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'joy': '0 8px 32px rgba(0,0,0,0.12)',
        'joy-lg': '0 16px 48px rgba(0,0,0,0.16)',
        'card': '0 4px 16px rgba(0,0,0,0.08)',
        'button': '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
