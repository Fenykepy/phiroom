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
    './src/js/client'
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
        exclude: path.join( __dirname, '/node_modules/'),
        include: __dirname
      },
      {
        // less files
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader',
        exclude: path.join( __dirname, '/node_modules/'),
      },
      {
        // images and fonts
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192', // inline base64 URLs for <=8k images, direct URLs for the rest
        exclude: path.join( __dirname, '/node_modules/'),
      }
    ],
  }
};

module.exports = config;


