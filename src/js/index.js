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


function portfolioEnter(nextState, replaceState, callback) {
  // fetch portfolio
  // fetch portfolio pictures
  // promise.all(portfolio, pictures).then(callaback())
  console.log(nextState)
  console.log('good :)')
  setTimeout(callback, 1500)
}

function rootEnter(nextState, replaceState, callback) {
  // fetch settings
  // fetch portfolios headers
  // promise.all([settings, headers]).then(callback())
}

render(
  <Provider store={store}>
    <Router history={history}>
      <Redirect from="/" to="/portfolio/" />
      <Route path="/" component={App} onEnter={rootEnter}>
        <Route path="portfolio/" component={Portfolio} onEnter={portfolioEnter} >
          <Route path=":slug" component={Portfolio} />
          <Route path=":slug/lightbox/:sha1" component={Portfolio} />
        </Route>
        <Route path="contact/" component={Portfolio} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)

