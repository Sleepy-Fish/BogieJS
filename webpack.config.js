const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bogie.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dev/'
  },
  devtool: env === 'development' ? 'inline-source-map' : false,
  devServer: {
    contentBase: './examples/',
    hot: true,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          formatter: 'codeframe'
        }
      }
    ]
  }
};
