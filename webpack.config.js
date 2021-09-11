// @ts-check
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'development',
  watch: true,

  // eval not work in extension background, choose another here
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'cheap-source-map',
  entry: {
    'content-script': './src/content-script',
  },
  output: {
    filename: '[name].js',
    path: path.resolve('chrome/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.properties$/,
        use: 'properties-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '...'],
    alias: {
      'devtools/client/shared/vendor/react': 'react',
      'devtools/client/shared/vendor/react-dom': 'react-dom',
      'devtools/client/shared/vendor/react-prop-types': 'prop-types',
      Services: path.resolve('src/services'),
      devtools: path.resolve('vendor/gecko/devtools'),
      l10n: path.resolve('vendor/l10n'),
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
  ],
}
