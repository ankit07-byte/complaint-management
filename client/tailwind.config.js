module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4f46e5',
            DEFAULT: '#4338ca',
            dark: '#3730a3'
          },
          secondary: {
            light: '#f59e0b',
            DEFAULT: '#d97706',
            dark: '#b45309'
          }
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif']
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography')
    ],
  }