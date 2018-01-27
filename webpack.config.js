const path = require('path')
const webpack = require('webpack')
const StringReplacePlugin = require('string-replace-webpack-plugin')

const mappings = [
  [
    /chrome:\/\/devtools\/skin/,
    result => {
      result.request = result.request.replace(
        './chrome://devtools/skin',
        path.resolve('./gecko-dev/devtools/client/themes')
      )
    },
  ],
  [
    /resource:\/\/devtools/,
    result => {
      result.request = result.request.replace(
        './resource://devtools',
        path.resolve('./gecko-dev/devtools')
      )
    },
  ],
]

module.exports = {
  entry: {
    'content-script': './src/content-script',
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
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')],
            },
          },
        ],
      },
      {
        test: /\.(png|svg)$/,
        use: 'url-loader',
      },
      {
        test: /\.properties$/,
        use: 'raw-loader',
      },
      {
        test: /LabelCell\.js$/,
        use: StringReplacePlugin.replace({
          replacements: [
            {
              // This fix React inline style
              pattern: /paddingInlineStart/g,
              replacement: function(match, p1, offset, string) {
                return 'WebkitPaddingStart'
              },
            },
          ],
        }),
      },
    ],
  },
  node: { fs: 'empty' },
  resolve: {
    alias: {
      devtools: path.resolve('gecko-dev/devtools'),
    },
  },
  plugins: [
    new StringReplacePlugin(),
    ...mappings.map(
      ([regex, res]) => new webpack.NormalModuleReplacementPlugin(regex, res)
    ),
  ],
}
