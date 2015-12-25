import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect, IndexRoute } from 'react-router'

import App from './containers/App'
import Portfolio from './components/Portfolio'
import PortfolioDetail from './components/PortfolioDetail'
import Weblog from './components/Weblog'
import WeblogList from './components/WeblogList'
import WeblogDetail from './components/WeblogDetail'
import Contact from './components/Contact'
import Lightbox from './components/Lightbox'
import LightboxStarter from './components/LightboxStarter'

function appendSlash(nextState, replaceState) {
  // add a slash at urls' end
  let url = nextState.location.pathname
  if (url.slice(-1) != "/") {
    replaceState(null, url + '/')
  }
}

export default () => {
  return (
    <Route>
      <Redirect from="/" to="/portfolio/" />
      <Redirect from="/weblog/page/1/" to="/weblog/" />
      <Route path="/" component={App} onEnter={appendSlash}>
        <Route path="/portfolio(/)" component={Portfolio}>
          <IndexRoute component={PortfolioDetail} />
          <Route path="/portfolio/:slug(/)" component={PortfolioDetail}>
            <Route path="/portfolio/:slug/lightbox/:lightbox(/)" component={LightboxStarter} onEnter={appendSlash} />
          </Route>
        </Route>
        <Route path="weblog(/)" component={Weblog} onEnter={appendSlash} >
          <IndexRoute component={WeblogList} />
          <Route path="/weblog/page/:page(/)" component={WeblogList} onEnter={appendSlash} />
          <Route path="/weblog/tag/:tag/page/:page(/)" component={WeblogList} onEnter={appendSlash} />
          <Route path="/weblog/tag/:tag(/)" component={WeblogList} onEnter={appendSlash} />
          <Route path="/weblog/:y/:m/:d/:slug(/)" component={WeblogDetail} onEnter={appendSlash}>
            <Route path="/weblog/:y/:m/:d/:slug/lightbox/:lightbox(/)" component={LightboxStarter} onEnter={appendSlash} />
          </Route>
        </Route>
        <Route path="contact(/)" component={Contact} />
      </Route>
    </Route>
  )
}
