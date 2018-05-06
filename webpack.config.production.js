const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'production',
  watch: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          drop_console: true,
        },
        output: {
          ascii_only: true, // This fix chrome.tabs.executeScript error: not utf-8
        },
      },
    }),
    new BundleAnalyzerPlugin(),
  ],
})
