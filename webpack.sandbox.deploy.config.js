const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './sandbox/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/bogie',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.scss'],
    alias: {
      '@': path.join(__dirname, 'sandbox'),
      '@src': path.join(__dirname, 'sandbox'),
    },
  },
  plugins: [
    new HtmlPlugin({
      title: 'Bogie Sandbox',
      template: 'sandbox/index.ejs',
      favicon: 'sandbox/bogie.png',
    }),
    new CleanWebpackPlugin(),
  ],
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
        exclude: /(node_modules)/,
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
};
