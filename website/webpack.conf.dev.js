const fs = require('fs'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  project = require('./project.json');

module.exports = {
  devtool: '#eval-source-map',
  output: {
    filename: project.scripts.dist.filename.dev
  },
  plugins: [
    new ExtractTextPlugin(project.styles.dist.filename.dev)
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: false,
    port: 7000
  }
}
