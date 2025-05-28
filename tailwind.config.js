/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  safelist: [
    'bg-neonCyan',
    'hover:bg-electricPink',
    'text-neonCyan',
    'text-electricPink',
  ],
  theme: {
    extend: {
      colors: {
        neonCyan: '#00f7ff',
        electricPink: '#ff00e0',
        deepBlack: '#0d0d0d',
        neonYellow: '#faff00',
        mintGlow: '#00ffcc',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': {
            opacity: 1,
            textShadow: '0 0 10px #00f7ff, 0 0 20px #00f7ff',
          },
          '50%': {
            opacity: 0.7,
            textShadow: '0 0 20px #00f7ff, 0 0 30px #00f7ff',
          },
        },
      },
    },
  },
  plugins: [],
};
