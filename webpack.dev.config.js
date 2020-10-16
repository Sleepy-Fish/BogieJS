const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'examples'),
      path.resolve(__dirname, 'node_modules'),
    ],
    hot: true,
  },
});
