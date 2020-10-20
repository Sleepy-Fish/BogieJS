const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bogie.js',
    path: path.resolve(__dirname, 'examples', 'dist'),
    library: 'Bogie',
    libraryTarget: 'window',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'examples'),
      path.resolve(__dirname, 'node_modules'),
    ],
    hot: true,
  },
});
