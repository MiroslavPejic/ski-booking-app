module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all JSX/JS files in your src folder
    './public/index.html', // Include the HTML file
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        hover: "#34495e"
      }
    },
  },
  plugins: [],
};
