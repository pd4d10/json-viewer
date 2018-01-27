const path = require('path')
const webpack = require('webpack')

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
  // [
  //   /chrome:\/\/devtools\/content/,
  //   result => {
  //     result.request = result.request.replace(
  //       './chrome://devtools/content',
  //       path.resolve('./gecko-dev/devtools/client/themes')
  //       path.join(__dirname, '..')
  //     )
  //   },
  // ],
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
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg)$/,
        use: 'file-loader',
      },
      {
        test: /\.properties$/,
        use: 'raw-loader',
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
    ...mappings.map(
      ([regex, res]) => new webpack.NormalModuleReplacementPlugin(regex, res)
    ),
  ],
}
