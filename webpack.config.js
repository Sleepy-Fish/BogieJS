const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    bogie: './src/index.ts',
    'bogie.min': './src/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Bogie',
    libraryTarget: 'commonjs2',
  },
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
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
      }),
    ],
  },
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
