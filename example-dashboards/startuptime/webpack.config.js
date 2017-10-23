const webpack = require('webpack');
const packageProperties = require('./package.json');
const entry = './main.js';
let loaders = [{
  test   : /\.js$/,
  exclude: /node_modules/,
  loader : 'babel-loader'
}];

module.exports = {
  entry,
  output: {
    path: __dirname,
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders
  }
}
