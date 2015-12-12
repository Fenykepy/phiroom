import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect } from 'react-router'

import App from './containers/App'
import Portfolio from './components/Portfolio'
import Contact from './components/Contact'


function appendSlash(nextState, replaceState) {
  // add a slash at urls' end
  let url = nextState.location.pathname
  if (url.slice(-1) != "/") {
    replaceState(null, url + '/')
  }
}

export default (store) => {
  
  const state = store.getState()
  const default_portfolio = state.portfolio.default_portfolio

  return (
    <Route path="/" component={App} onEnter={appendSlash}>
      <Redirect from="/" to={`/portfolio/${default_portfolio}`} />
      <Redirect from="/portfolio(/)" to={`/portfolio/${default_portfolio}`} />
      <Route path="portfolio(/)" component={Portfolio}>
        <Route path=":slug(/)" component={Portfolio} />
        <Route path=":slug/lightbox/:sha1(/)" component={Portfolio} />
      </Route>
      <Route path="contact(/)" component={Portfolio} />
    </Route>
  )
}
