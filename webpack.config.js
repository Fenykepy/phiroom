/* sources of learning webpack :
 *
 * http://christianalfoni.github.io/react-webpack-cookbook/Running-a-workflow.html
 * https://github.com/petehunt/webpack-howto
 *
 */

var path = require('path');
var webpack = require('webpack');


var config = {
  // sourceMaps simplified to a single mapping per line
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join( __dirname, 'dist' ),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        // js files
        test: /\.js$/,
        loaders: ['babel'],
        exclude: '/node_modules/',
        include: __dirname
      },
      {
        // less files
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ],
  }
};

module.exports = config;


