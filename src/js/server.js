import Express from 'express'
import cookieParser from 'cookie-parser'

import React from 'react'
import { renderToString } from 'react-dom/server'

import { Provider } from 'react-redux'

import { match, RoutingContext } from 'react-router'

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import config from '../../webpack.config'

import { createStoreWithMiddleware } from './store'
import getRoutes from './routes'
import rootReducer from './reducers'

import { fetchCommonData } from './helpers/fetchCommonData'
import { base_url } from './config'


var app = new Express()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// serve statics for developments
app.use('/assets', Express.static(__dirname + '/../../assets'))
app.use('/media', Express.static(__dirname + '/../api/phiroom/data'))

// get cookies
app.use(cookieParser())


function handleRender(req, res) {

  // redirect to default portfolio
  if (req.url == '/portfolio/') {
    console.log('true')
    fetch(`${base_url}api/portfolio/headers/`)
      .then(response =>
          response.json()
      )
      .then(json => {
        res.redirect(302, req.url + json[0].slug)
      })
  }

  
  match({ routes: getRoutes(), location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      console.log('redirect', redirectLocation)
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // create a new redux store instance
      const store = createStoreWithMiddleware(rootReducer)
      // fetch common datas 
      let promises = fetchCommonData(store)

      // fetch all components data's
      // if they have a static method fetchData(dispatch, params)
      let components = renderProps.components
      for (let i=0, l=components.length; i < l; i++) {
        if (components[i] && components[i].fetchData) {
          let datas = components[i].fetchData(
            store.dispatch, renderProps.params)
          // add new promises to main array
          promises = [...promises, ...datas]
        }
      }

      // when all promised resolve, 
      Promise.all(promises).then((values) => {
        // get initial state
        const initialState = store.getState()
        // compile react components
        const html = renderToString(
          <Provider store={store}>
            <RoutingContext {...renderProps}/>
          </Provider>
        )
        res.status(200).send(renderFullPage(html, initialState))
      })
      .catch((error) => {
        // send error if a promise fail
        res.status(500).send(error.message)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
}


function renderFullPage(html, initialState, title='') {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <link rel="stylesheet" href="/static/styles.css" />
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
