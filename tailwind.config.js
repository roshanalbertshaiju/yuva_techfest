/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        orbitron: ['var(--font-orbitron)', 'Orbitron', 'sans-serif'],
      },
      colors: {
        'electric-blue': '#00d4ff',
        'neon-purple': '#bf00ff',
        'cyber-green': '#00ff9f',
        'dark-void': '#020408',
        'dark-deep': '#050b14',
        'dark-card': '#0a1628',
        'glow-blue': '#0099ff',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'border-glow': 'borderGlow 2s ease-in-out infinite',
        spotlight: "spotlight 2s ease .75s 1 normal forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px #00d4ff44' },
          '50%': { boxShadow: '0 0 60px #00d4ffaa, 0 0 100px #00d4ff44' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: '#00d4ff44' },
          '50%': { borderColor: '#00d4ffcc' },
        },
      },
      backgroundImage: {
        'cyber-grid': `linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}
