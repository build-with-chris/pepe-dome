import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Black Tones
        'pepe-black': '#000000',
        'pepe-dark': '#111111',
        'pepe-ink': '#161616',
        'pepe-coal': '#0A0A0A',
        'pepe-surface': '#1A1A1A',

        // Text Hierarchy
        'pepe-white': '#FFFFFF',
        'pepe-t80': 'rgba(255, 255, 255, 0.80)',
        'pepe-t64': 'rgba(255, 255, 255, 0.64)',
        'pepe-t48': 'rgba(255, 255, 255, 0.48)',
        'pepe-t32': 'rgba(255, 255, 255, 0.32)',

        // UI Lines
        'pepe-line': '#333333',
        'pepe-line2': '#292929',
        'pepe-line-light': '#3A3A3A',

        // Gold Accent - Primary
        'pepe-gold': '#D4A574',
        'pepe-gold-hover': '#E6B887',
        'pepe-gold-active': '#C19A64',

        // Secondary Warm Tones
        'pepe-bronze': '#B8860B',
        'pepe-bronze-hover': '#C69315',
        'pepe-amber': '#FFBF00',
        'pepe-copper': '#B87333',

        // Semantic Colors
        'pepe-success': '#00DC82',
        'pepe-warning': '#FFB800',
        'pepe-error': '#FF3B3B',
        'pepe-info': '#0096FF',
      },

      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },

      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },

      spacing: {
        '0.5': '0.125rem',   // 2px
        '1': '0.25rem',      // 4px
        '1.5': '0.375rem',   // 6px
        '2': '0.5rem',       // 8px
        '3': '0.75rem',      // 12px
        '4': '1rem',         // 16px
        '5': '1.25rem',      // 20px
        '6': '1.5rem',       // 24px
        '8': '2rem',         // 32px
        '10': '2.5rem',      // 40px
        '12': '3rem',        // 48px
        '16': '4rem',        // 64px
        '20': '5rem',        // 80px
        '24': '6rem',        // 96px
        '32': '8rem',        // 128px
      },

      borderRadius: {
        'sm': '0.25rem',     // 4px
        'md': '0.5rem',      // 8px
        'lg': '0.75rem',     // 12px
        'xl': '1rem',        // 16px
        '2xl': '1.25rem',    // 20px
        '3xl': '1.5rem',     // 24px
      },

      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.2)',
        'xl': '0 12px 28px rgba(0, 0, 0, 0.35)',
        '2xl': '0 24px 48px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 16px rgba(212, 165, 116, 0.25)',
        'glow-strong': '0 0 24px rgba(212, 165, 116, 0.4)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
