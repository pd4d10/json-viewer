// @ts-check
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const config = require('./webpack.config')

/** @type {import('webpack').Configuration} */
module.exports = {
  ...config,
  mode: 'production',
  watch: false,
  plugins: [...config.plugins, new BundleAnalyzerPlugin()],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { ascii_only: true }, // fix chrome.tabs.executeScript error: not utf-8
          compress: { drop_console: true },
        },
      }),
    ],
  },
}
