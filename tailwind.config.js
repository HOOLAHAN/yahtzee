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
        'ping-glow': 'pingGlow 2s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'spin-wiggle': 'spinWiggle 0.8s ease-in-out',
        'glow-border': 'glowBorder 2s ease-in-out infinite',
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
        pingGlow: {
          '0%': {
            transform: 'scale(0.95)',
            opacity: '0.7',
            boxShadow: '0 0 10px #00f7ff, 0 0 20px #00f7ff',
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1',
            boxShadow: '0 0 20px #00f7ff, 0 0 30px #00f7ff',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '0',
            boxShadow: '0 0 10px #00f7ff, 0 0 20px #00f7ff',
          },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        spinWiggle: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(18deg)' },
          '30%': { transform: 'rotate(-18deg)' },
          '45%': { transform: 'rotate(12deg)' },
          '60%': { transform: 'rotate(-12deg)' },
          '75%': { transform: 'rotate(6deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        glowBorder: {
          '0%, 100%': {
            boxShadow: '0 0 8px #faff00, 0 0 16px #faff00',
          },
          '50%': {
            boxShadow: '0 0 12px #faff00, 0 0 24px #faff00',
          },
        },
      },
    },
  },
  plugins: [],
};
