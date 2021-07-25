// @ts-check
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const mozillaCentral = path.resolve('vendor/mozilla-central-ab524816237c')

/** @type {webpack.Configuration} */
module.exports = {
  mode: 'development',
  watch: true,
  entry: {
    'content-script': './src/content-script',
    render: './src/render',
    background: './src/background',
  },
  devtool: 'source-map',
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
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: new RegExp('chrome://devtools/skin', 'g'),
                  replace: 'devtools/client/themes',
                },
                {
                  search: new RegExp('chrome://devtools/content', 'g'),
                  replace: 'devtools/client',
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|svg)$/,
        type: 'asset',
      },
      {
        test: /\.properties$/,
        use: 'properties-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'devtools/client/shared/vendor/react': 'react',
      'devtools/client/shared/vendor/react-dom': 'react-dom',
      'devtools/client/shared/vendor/react-prop-types': 'prop-types',
      Services: path.resolve('src/services'),
      devtools: path.resolve(mozillaCentral, 'devtools'),
    },
  },
  plugins: [new CleanWebpackPlugin()],
}
