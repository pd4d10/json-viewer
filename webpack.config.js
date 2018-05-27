const path = require('path')
const webpack = require('webpack')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const mappings = [
  [
    /chrome:\/\/devtools\/skin/,
    result => {
      result.request = result.request.replace(
        './chrome://devtools/skin',
        path.resolve('./gecko-dev/devtools/client/themes'),
      )
    },
  ],
  [
    /resource:\/\/devtools/,
    result => {
      result.request = result.request.replace(
        './resource://devtools',
        path.resolve('./gecko-dev/devtools'),
      )
    },
  ],
]

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
      // Seems not work here, overwrite it in `reset.css`
      // {
      //   test: /\common.css$/,
      //   use: StringReplacePlugin.replace({
      //     replacements: [
      //       {
      //         pattern: /#filterinput/g,
      //         replacement: () => {
      //           return ''
      //         },
      //       },
      //     ],
      //   }),
      // },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
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
        use: 'properties-loader',
      },
    ],
  },
  node: { fs: 'empty' },
  resolve: {
    alias: {
      'devtools/client/shared/vendor/react': 'react',
      'devtools/client/shared/vendor/react-dom': 'react-dom',
      'devtools/client/shared/vendor/react-prop-types': 'prop-types',
      devtools: path.resolve('gecko-dev/devtools'),
    },
  },
  plugins: [
    new CleanWebpackPlugin('chrome/dist'),
    new StringReplacePlugin(),
    ...mappings.map(
      ([regex, res]) => new webpack.NormalModuleReplacementPlugin(regex, res),
    ),
  ],
}
