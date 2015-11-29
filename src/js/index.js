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

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App} >
        <Redirect from="/" to="/portfolio"/>
        <Route path="portfolio" component={Portfolio} />
        <Route path="portfolio/:slug" component={Portfolio} />
        <Route path="portfolio/:slug/lightbox/:sha1" component={Portfolio} />
        <Route path="contact" component={Portfolio} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

