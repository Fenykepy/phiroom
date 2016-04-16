// import a promise polyfill
require('es6-promise').polyfill();
// import less files
require('../less/controller.less')

import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'react-redux'
import { createStoreWithMiddleware } from './store'
import rootReducer from './reducers/main'

import { Router, browserHistory } from 'react-router'
import getRoutes from './routes'

import { fetchCommonData } from './helpers/fetchCommonData'
import { verifyToken } from './actions/user'

// get state provided by server
const initialState = window.__INITIAL_STATE__

let store
if (initialState) {
  store = createStoreWithMiddleware(rootReducer, initialState)
} else {
  store = createStoreWithMiddleware(rootReducer)
}

// Every time the state changes, log it
/*
let unsubscribe = store.subscribe(() =>
  console.log('state', store.getState())
)
*/

// try to authenticate user
store.dispatch(verifyToken())

// fetch common data
let promises = fetchCommonData(store)


const routes = <Router history={browserHistory} routes={getRoutes()} />

render(
  <Provider store={store}>
   {routes}
  </Provider>,
  document.getElementById('root')
)

