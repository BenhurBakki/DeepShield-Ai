/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-black': '#020408',
        'dark-navy': '#0a0f1e',
        'navy': '#0d1529',
        'card': '#0f1a2e',
        'electric-blue': '#0ea5e9',
        'cyan-glow': '#06b6d4',
        'neon-purple': '#8b5cf6',
        'neon-pink': '#ec4899',
        'danger': '#ef4444',
        'warning': '#f59e0b',
        'success': '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(14,165,233,0.05)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14,165,233,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14,165,233,0.8), 0 0 60px rgba(6,182,212,0.4)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(14,165,233,0.3)' },
          '50%': { borderColor: 'rgba(6,182,212,0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(14,165,233,0.4), 0 0 40px rgba(14,165,233,0.1)',
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4), 0 0 40px rgba(6,182,212,0.1)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(14,165,233,0.2)',
      },
    },
  },
  plugins: [],
}
