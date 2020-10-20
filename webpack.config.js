const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'none',
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.join(__dirname, 'src'),
      '@src': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      files: './src/',
      extensions: ['js', 'ts'],
    }),
  ],
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules|dist|webpack.*.js)/,
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /(node_modules|dist|webpack.*.js)/,
      },
    ],
  },
};
