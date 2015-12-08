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

export default (store, promises) => {
  
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

  return (
    <Route path="/" component={App} onEnter={appendSlash}>
      <Redirect from="/" to="/portfolio/" />
      <Route path="portfolio(/)" component={Portfolio} onEnter={portfolioEnter}>
        <Route path=":slug(/)" component={Portfolio} />
        <Route path=":slug/lightbox/:sha1(/)" component={Portfolio} />
      </Route>
      <Route path="contact(/)" component={Portfolio} />
    </Route>
  )
}
