/* sources of learning webpack :
 *
 * http://christianalfoni.github.io/react-webpack-cookbook/Running-a-workflow.html
 * https://github.com/petehunt/webpack-howto
 *
 */

var webpack = require('webpack');
var path = require('path');


var config = {
    entry: {
        boot: path.resolve( __dirname, 'js/boot.js' )
    },

    output: {
        path: path.resolve( __dirname, 'build' ),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/, /vendor/],
                loaders: ['babel-loader']
            },
            { test: /\.json$/, loader: 'json-loader'}
        ]
    },

    debug: false,
    devtool: '#source-map'
};

module.exports = config;


