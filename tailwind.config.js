module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f0',
          100: '#dcebdc',
          500: '#2f6b3e',
          600: '#265631',
          700: '#1d4226',
          900: '#0f2613',
        },
        sand: {
          100: '#f5efe1',
          200: '#ece0c4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
