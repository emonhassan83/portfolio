const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx}'),
  ],
  theme: {
    extend: {
      // Backend portfolio tokens (values live in src/styles/portfolio.css)
      colors: {
        bk: {
          bg: 'var(--bk-bg)',
          surface: 'var(--bk-surface)',
          raised: 'var(--bk-raised)',
          line: 'var(--bk-line)',
          fg: 'var(--bk-fg)',
          muted: 'var(--bk-muted)',
          dim: 'var(--bk-dim)',
          accent: 'var(--bk-accent)',
          'accent-ink': 'var(--bk-accent-ink)',
          'on-accent': 'var(--bk-on-accent)',
          warn: 'var(--bk-warn)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '1200px',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      // Dashboard theme: the home page's dark palette and lime accent (src/styles/portfolio.css).
      {
        portfolio: {
          primary: "#c5f738",
          "primary-content": "#101006",
          secondary: "#989689",
          "secondary-content": "#0f0f0a",
          accent: "#c5f738",
          "accent-content": "#101006",
          neutral: "#2d2d26",
          "neutral-content": "#ebe8dd",
          "base-100": "#0f0f0a",
          "base-200": "#161510",
          "base-300": "#1e1d17",
          "base-content": "#ebe8dd",
          info: "#7cc4ff",
          success: "#c5f738",
          "success-content": "#101006",
          warning: "#ffb547",
          "warning-content": "#1a1206",
          error: "#ff6b5e",
          "error-content": "#1a0806",
          "--rounded-box": "0.375rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "0.25rem",
          "--tab-radius": "0.25rem",
        },
      },
    ],
  }
}
