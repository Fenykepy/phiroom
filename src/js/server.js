import Express from 'express'
import cookieParser from 'cookie-parser'
import responseTime from 'response-time'
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

import { buildDocumentTitle } from './actions/common'
import { receiveToken } from './actions/user'

import settings from './config'

import webpackAssets from '../../webpack-assets.json'

import fs from 'fs'

var app = new Express()

//var SERVER_RENDERING = false
var SERVER_RENDERING = true

// get response time in header  
app.use(responseTime())

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

if (! settings.statics_proxy) {
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
        // set auth_token cookie if user is authenticated
        if (initialState.common.user.token) {
          res.cookie('auth_token', initialState.common.user.token)
        }

        // serve rendered html
        res.status(200).send(renderFullPage(html, initialState))
      })
      .catch((error) => {
        // send error if a promise fail
        console.log(error)
        res.status(500).send(error.message)
      })
    } else {
      res.status(404).send('Not found')
    }
  })
}

function getTitle(state) {
  // set document title
  return buildDocumentTitle(state)
}

function getAuthorMeta(state) {
  // if we have an author, populate meta
  if (state && state.common.author) {
    return `<meta name="author" content="${state.common.author}" />`
  }
  return ''
}

function getDescriptionMeta(state) {
  // if we have a description, populate meta
  if (state && state.common.description) {
    return `<meta name="description" content="${state.common.description}" />`
  }
  return ''
}

function getGoogleSiteIDMeta(state) {
  // if we have a google site ID, populate meta
  if (state && state.common.settings.google_site_verification_id) {
    return `<meta name="google-site-verification"
              content="${state.common.settings.google_site_verification_id}" />`
  }
  return ''
}

function getGoogleAnalyticsScript(state) {
  if (! state) return ''
  let settings = state.common.settings
  if (settings.google_analytics_id) {
    return `<script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', '${settings.google_analytics_id}', 'auto');
      ga('send', 'pageview');

    </script>`
  }
  return ''
}

function getPiwikAnalyticsScript(state) {
  if (! state) return ''
  let settings = state.common.settings
  if (settings.piwik_analytics_site_id && settings.piwik_analytics_url) {
    // if we have piwik analytics site ID and url in settings, we include script.
    return `<!-- Piwik -->
      <script type="text/javascript">
          var _paq = _paq || [];
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
          var u="//${settings.piwik_analytics_url}/";
          _paq.push(['setTrackerUrl', u+'piwik.php']);
          _paq.push(['setSiteId', ${settings.piwik_analytics_site_id}]);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
          })();
          </script>
      <!-- End Piwik Code -->`
  }
  return ''
}


function renderFullPage(html, initialState) {
  
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${getTitle(initialState)}</title>
        ${getDescriptionMeta(initialState)} 
        ${getAuthorMeta(initialState)}
        <meta charset="utf-8" />
        <meta name="generator" content="Phiroom 0.3.0" />
        ${getGoogleSiteIDMeta(initialState)}
        <link rel="stylesheet" href="${webpackAssets.app.css}" />
        <link rel="icon" type="image/svg" href="/assets/images/phiroom-favicon.svg" />
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="${webpackAssets.app.js}"></script>
        ${getGoogleAnalyticsScript(initialState)}
        ${getPiwikAnalyticsScript(initialState)}
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

function resetSocket(sock) {
  /* 
   * We first delete socket if file exists,
   * as it's not automatically done at shutdown,
   * else it throws a error
   */
  try {
    fs.accessSync(sock, fs.F_OK, (error) => {throw error})
    console.log("Socket file exists, delete it.")
    fs.unlinkSync(sock)
  } catch (e) {
    return
  }
}

if (typeof settings.port == "string") {
  /*
   * If we use a socket, first delete file if
   * it exists
   */
  resetSocket(settings.port)
}

app.listen(settings.port, function(error) {
  if (error) {
    console.error(error)
  } else {
    // we give rights to socket else nginx can't use it
    if (typeof settings.port == "string" && fs.lstatSync(settings.port).isSocket()) {
      fs.chmodSync(settings.port, '777');
    }
    console.info("==> Listening on port %s. Openup http://localhost:%s/ in your browser.", settings.port, settings.port)
  }
})
