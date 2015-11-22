// import less files
require('../less/controller.less')

import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import App from './containers/App'
import rootReducer from './reducers'


import { selectPortfolio, fetchPortfolio } from './actions/portfolios'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
)(createStore)

const store = createStoreWithMiddleware(rootReducer)

// Every time the state changes, log it
let unsubscribe = store.subscribe(() =>
  console.log('state', store.getState())
)

let default_portfolio = store.getState().portfolio.headers[0].slug

store.dispatch(selectPortfolio(default_portfolio))
store.dispatch(fetchPortfolio(default_portfolio))
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

