
const path = require('path');

module.exports = {
  entry: './src/server.js', // Your entry file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.yaml$/,
        use: 'yaml-loader',
      },
    ],
  },
};
