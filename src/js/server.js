import Express from 'express'
import React from 'react'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpack from 'webpack'
import config from '../../webpack.config'

import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'

var app = new Express()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// serve statics for developments
app.use('/assets', Express.static(__dirname + '/../../assets'))
app.use('/media', Express.static(__dirname + '/../api/phiroom/data'))

app.get("*", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> Listening on port %s. Openup http://localhost:%s/ in your browser.", port, port)
  }
})
