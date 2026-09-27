/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#fcfdfc',
        ink: '#131815',
        muted: '#5b655e',
        hairline: '#e4e9e4',
        iconRail: '#eef1ed',
        previewStage: '#f1f5f1',
        emerald: {
          DEFAULT: '#0ea968',
          deep: '#0b8a54',
          tint: '#e7f4ec',
          border: '#cde7d7',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        '2xs': '0 1px 2px rgba(19, 24, 21, 0.04)',
        'emerald-btn': '0 2px 8px -1px rgba(14, 169, 104, 0.28), 0 1px 3px rgba(14, 169, 104, 0.15)',
        'preview-frame': '0 12px 36px -8px rgba(19, 24, 21, 0.08), 0 4px 12px -2px rgba(14, 169, 104, 0.04)',
      },
    },
  },
  plugins: [],
}
