const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const env = process.env.NODE_ENV;

module.exports = {
  entry: {
    bogie: './src/index.js',
    'bogie.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Bogie',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  devtool: env === 'development' ? 'inline-source-map' : 'source-map',
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'examples'),
      path.resolve(__dirname, 'node_modules')
    ],
    hot: true,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    env === 'development' ? new webpack.HotModuleReplacementPlugin() : () => {}
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ]
  },
  performance: {
    hints: false
  },
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
