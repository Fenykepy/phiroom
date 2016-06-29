import Express from 'express'
import cookieParser from 'cookie-parser'

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
import rootReducer from './reducers/main'

import { fetchCommonData } from './helpers/fetchCommonData'
import Fetch from './helpers/http'

import { buildDocumentTitle } from './actions/title'
import { receiveToken } from './actions/user'

import { statics_proxy, port } from './config'

import webpackAssets from '../../webpack-assets.json'

import fs from 'fs'

var app = new Express()

//var SERVER_RENDERING = false
var SERVER_RENDERING = true

// we are in development mode
if (process.env.NODE_ENV != 'production') {
  // use hot reloading in development
  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
} else {
  // we are in production
  // force server rendering
  SERVER_RENDERING = true
}

if (! statics_proxy) {
  // serve statics for developments 
  app.use('/assets', Express.static(__dirname + '/../../assets'))
  app.use('/media', Express.static(__dirname + '/../api/phiroom/data'))
  app.use('/static', Express.static(__dirname + '/../../dist'))
}


// get parsed cookies
app.use(cookieParser())
  
  
function handleRender(req, res) {

  // redirect to default portfolio
  if (req.url == '/portfolio/') {
    Fetch.get('api/portfolio/headers/')
      .then(json => {
        // if we have portfolio
        // we redirect to first one
        if (json[0]) {
          res.redirect(302, req.url + json[0].slug)
        }
      })
  }

  
  match({ routes: getRoutes(), location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // create a new redux store instance
      const store = createStoreWithMiddleware(rootReducer)
      // authenticate user if necessary
      if (req.cookies.auth_token) {
        store.dispatch(receiveToken(req.cookies.auth_token))
      }
      // fetch common datas 
      let promises = fetchCommonData(store)

      // fetch all components data's
      // if they have a static method fetchData(dispatch, params)
      let components = renderProps.components
      for (let i=0, l=components.length; i < l; i++) {
        if (components[i] && components[i].fetchData) {
          // fetch components requirements
          let datas = components[i].fetchData(
            store.dispatch, renderProps.params)
          // add new promises to main array
          promises = [...promises, ...datas]
        }
        if (components[i] && components[i].sendHit) {
          // send view hit if necessary with client IP
          components[i].sendHit(
            store.dispatch,
            renderProps.params,
            req.headers.remote_addr
          )
        }
      }

      // when all promised resolve, 
      Promise.all(promises).then((values) => {
        // get initial state
        const initialState = store.getState()
        // compile react components
        const html = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps}/>
          </Provider>
        )
        // set document title if necessary
        const title = buildDocumentTitle(initialState)

        // set auth_token cookie if user is authenticated
        if (initialState.common.user.token) {
          res.cookie('auth_token', initialState.common.user.token)
        }

        // serve rendered html
        res.status(200).send(renderFullPage(html, initialState, title))
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
        <link rel="stylesheet" href="${webpackAssets.app.css}" />
        <link rel="icon" type="image/png" href="/assets/images/phiroom-favicon.svg" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
      <script src="${webpackAssets.app.js}"></script>
      </body>
    </html>
    `
}



if (SERVER_RENDERING) {
  // fired each time serverside receive a request
  app.use(handleRender)
} else {
  app.get("*", function(req, res) {
    res.status(200).send(renderFullPage('', null))
  })
}




if (typeof port == "string" && fs.lstatSync(port).isSocket()) {
    // we unlink socket if it exists as it's not
    // deleted at shutdown and create errors
    fs.unlinkSync(port)
}

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    // we give rights to socket else nginx can't use it
    if (typeof port == "string" && fs.lstatSync(port).isSocket()) {
      fs.chmodSync(port, '777');
    }
    console.info("==> Listening on port %s. Openup http://localhost:%s/ in your browser.", port, port)
  }
})
