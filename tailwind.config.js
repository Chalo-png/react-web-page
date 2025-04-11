/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'gold-glow': 'glow 2s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-in',
        slideInUp: 'slideInUp 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(197, 160, 48, 0.6))' },
          '50%': { filter: 'drop-shadow(0 0 4px rgba(197, 160, 48, 0.8))' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      colors: {
        primary: "#B29704",       // Muted antique gold (less yellow, more depth)
        secondary: "#A68A00",     // Deep olive-gold 
        accent: "#8A6F0A",        // Burnished bronze-gold
        neutral: "#F5F3EF",       // Warm parchment white
        info: "#7C9EB2",          // Softened steel blue
        success: "#286140",       // Deep forest green
        warning: "#B76E3A",       // Terra cotta
        error: "#9E1B1B",         // Crimson burgundy
        light: {
          "base-100": "#FFFDFA",  // Bright warm white
          "base-content": "#1A1A1A",
          background: "#F4F1EB",  // Subtle creamy backdrop
        },
        dark: {
          "base-100": "#2D2A24",  // Warm charcoal
          "base-content": "#EDE9E1",
          background: "#1E1C18",  // Deep espresso base
        },
      },



      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C5A030 0%, #D4AF37 50%, #A68521 100%)',
        'velvet-texture': "url('/src/assets/velvet-texture.png')",
      },
      backdropBlur: {
        lg: '16px',
      },
      boxShadow: {
        'gold-glow': '0 4px 24px -2px rgba(212, 175, 55, 0.15)',
      },
    },
  },

  plugins: [
    require("daisyui"),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],

  // tailwind.config.js
  daisyui: {
    themes: [
      "light", "dark",
    ],
  }

};

