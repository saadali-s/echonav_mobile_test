/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./core/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#fafafa',
        surface: '#ffffff',
        border: '#e4e4e7',
        borderStrong: '#18181b',
        borderLight: '#f4f4f5',
        textPrimary: '#18181b',
        textSecondary: '#71717a',
        textMuted: '#a1a1aa',
        textInverse: '#ffffff',
        textLink: '#52525b',
        successBg: '#dcfce7',
        successText: '#166534',
        successBorder: '#166534',
        infoBg: '#dbeafe',
        infoText: '#1e40af',
        infoBorder: '#1e40af',
        warningBg: '#fef9c3',
        warningText: '#854d0e',
        warningBorder: '#854d0e',
        dangerBg: '#fee2e2',
        dangerText: '#b91c1c',
        dangerBorder: '#b91c1c',
        activeGreen: '#10b981',
        activeGreenBg: 'rgba(16, 185, 129, 0.2)',
        overlay: 'rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}