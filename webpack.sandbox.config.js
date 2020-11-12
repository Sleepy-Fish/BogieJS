const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './sandbox/index.ts',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: [
      path.resolve(__dirname, 'sandbox'),
      path.resolve(__dirname, 'node_modules'),
    ],
    hot: true,
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
    new ESLintPlugin({
      files: './sandbox/',
      extensions: ['js', 'ts'],
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
