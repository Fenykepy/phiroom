import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect, IndexRoute } from 'react-router'

import App from './containers/App'
import Contact from './containers/Contact'
import Login from './containers/Login'
import Logout from './containers/Logout'

import Librairy from './components/Librairy'
import LibrairyPortfolio from './components/LibrairyPortfolio'
import LibrairyAll from './components/LibrairyAll'
import Portfolio from './components/Portfolio'
import PortfolioDetail from './components/PortfolioDetail'
import Weblog from './components/Weblog'
import WeblogList from './components/WeblogList'
import WeblogListByTag from './components/WeblogListByTag'
import WeblogDetail from './components/WeblogDetail'
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
          <Route path="/weblog/tag/:tag/page/:page(/)" component={WeblogListByTag} onEnter={appendSlash} />
          <Route path="/weblog/tag/:tag(/)" component={WeblogListByTag} onEnter={appendSlash} />
          <Route path="/weblog/:y/:m/:d/:slug(/)" component={WeblogDetail} onEnter={appendSlash}>
            <Route path="/weblog/:y/:m/:d/:slug/lightbox/:lightbox(/)" component={LightboxStarter} onEnter={appendSlash} />
          </Route>
        </Route>
        <Route path="contact(/)" component={Contact} onEnter={appendSlash} />
        <Route path="librairy(/)" component={Librairy} onEnter={appendSlash}>
          <Route path="portfolio/:slug(/)" component={LibrairyPortfolio} onEnter={appendSlash} />
          <Route path="all(/)" component={LibrairyAll} onEnter={appendSlash} />
        </Route>
        <Route path="login(/)" component={Login} onEnter={appendSlash} />
        <Route path="logout(/)" component={Logout} onEnter={appendSlash} />
      </Route>
    </Route>
  )
}
