// import a promise polyfill
require('es6-promise').polyfill();
// import less files
require('../less/controller.less')

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter } from 'redux-simple-router'
import thunkMiddleware from 'redux-thunk'

import { fetchPortfoliosHeadersIfNeeded } from './actions/portfolios'
import getRoutes from './routes'
import rootReducer from './reducers'

// get state provided by server
const initialState = window.__INITIAL_STATE__

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
)(createStore)

const store = createStoreWithMiddleware(rootReducer, initialState)
const history = createBrowserHistory()

syncReduxAndRouter(history, store)


// Every time the state changes, log it
let unsubscribe = store.subscribe(() =>
  console.log('state', store.getState())
)

let fetchCommonDataDeffered = function () {
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
let promises = fetchCommonDataDeffered()

const routes = <Router history={history} routes={getRoutes(store, promises)} />

render(
  <Provider store={store}>
   {routes}
  </Provider>,
  document.getElementById('root')
)

