// import a promise polyfill
require('es6-promise').polyfill();
// import less files
require('../less/controller.less')

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, Redirect } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter } from 'redux-simple-router'
import thunkMiddleware from 'redux-thunk'

import { fetchPortfoliosHeadersIfNeeded } from './actions/portfolios'
import App from './containers/App'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'
import rootReducer from './reducers'


const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
)(createStore)

const store = createStoreWithMiddleware(rootReducer)
const history = createBrowserHistory()

syncReduxAndRouter(history, store)


// Every time the state changes, log it
let unsubscribe = store.subscribe(() =>
  console.log('state', store.getState())
)

let commonDataDiffered = function () {
  let promises = []
  // fetch current user data
  // fetch settings
  // fetch portfolios headers if necessary
  promises.push(
      store.dispatch(fetchPortfoliosHeadersIfNeeded())
  )
  // return a list of promises to wait for server side
  return promises
}

// fetch common data
let promises = commonDataDiffered()


function rootEnter(nextState, replaceState) {
  // add a slash at urls' end
  let url = nextState.location.pathname
  if (url.slice(-1) != "/") {
    replaceState(null, url + '/')
  }
}


function portfolioEnter(nextState, replaceState, callback) {
  // if we have a slug, let's go
  if (nextState.params.slug != undefined) callback()
  // else redirect to default portfolio
  promises[0].then(() => {
    let slug = store.getState().portfolio.headers.data[0].slug
    replaceState(null, `/portfolio/${slug}/`)
    callback()
  })
}


render(
  <Provider store={store}>
    <Router history={history}>
      <Redirect from="/" to="/portfolio/" />
      <Route path="/" component={App} onEnter={rootEnter}>
        <Route path="portfolio(/)" component={Portfolio} onEnter={portfolioEnter}>
          <Route path=":slug(/)" component={Portfolio} />
          <Route path=":slug/lightbox/:sha1(/)" component={Portfolio} />
        </Route>
        <Route path="contact(/)" component={Portfolio} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

