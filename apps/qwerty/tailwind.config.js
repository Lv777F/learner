const {
  createGlobPatternsForDependencies,
} = require('@nx/js/src/utils/generate-globs');
const { join } = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*.{html,ts,tsx,css}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    function ({ addComponents, addBase }) {
      addBase({
        '@property --count': {
          syntax: '"<integer>"',
          'initial-value': '0',
          inherits: 'false',
        },
      });
      addComponents({
        '.counter': {
          transition: '--count 0.3s',
          'counter-reset': 'num calc(var(--count))',
          '&::before': {
            content: 'counter(num)',
          },
        },
      });
    },
  ],
  daisyui: {
    themes: true,
  },
};
