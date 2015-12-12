import Express from 'express'

import React from 'react'
import { renderToString } from 'react-dom/server'

import { Provider } from 'react-redux'

import { match, RouterContext } from 'react-router'

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import config from '../../webpack.config'

import { createStoreWithMiddleware } from './store'
import getRoutes from './routes'
import rootReducer from './reducers'

var app = new Express()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// serve statics for developments
app.use('/assets', Express.static(__dirname + '/../../assets'))
app.use('/media', Express.static(__dirname + '/../api/phiroom/data'))


function handleRender(req, res) {

  // create a new redux store instance
  const store = createStoreWithMiddleware(rootReducer)
  // get routes
  const routes = getRoutes(store)
  // compile react components
  const html = renderToString(
    <Provider store={store}>
     <div>Server side compiled !</div>
    </Provider>
  )
  // get initial state
  const initialState = store.getState()

  res.send(renderFullPage(html, initialState))
  
  /*match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      console.log('render props', renderProps)
      //res.status(200).send(renderToString(<RouterContext {...renderProps} />))
    } else {
      res.status(404).send('Not found')
    }
  })*/
}


function renderFullPage(html, initialState, title='') {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="/assets/images/phiroom-favicon.png" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
      <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

// fired each time serverside receive a request
app.use(handleRender)

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> Listening on port %s. Openup http://localhost:%s/ in your browser.", port, port)
  }
})
