var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');

var app = new express();
var port = 3000;

var compiler = webpack(config);
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath }));
app.use(webpackHotMiddleware(compiler));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/media', express.static(__dirname + '/api/phiroom/data'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> Listening on port %s. Openup http://localhost:%s/ in your browser.", port, port);
  }
})
