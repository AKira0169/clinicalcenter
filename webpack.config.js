const path = require('path');

module.exports = {
  mode: 'production', // or 'production'
  entry: './public/js/index.js', // Path to your entry file
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'public/js'), // Output directory
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
      },
    ],
  },
};
