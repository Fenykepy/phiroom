import React from 'react'
import { render } from 'react-dom'
import { Route, Redirect, IndexRoute } from 'react-router'

import App from './containers/App'
import WeblogWrapper from './containers/WeblogWrapper'
import Portfolio from './containers/Portfolio'
import PortfolioDetail from './containers/PortfolioDetail'
import Weblog from './containers/Weblog'
import WeblogList from './containers/WeblogList'
import WeblogListByTag from './containers/WeblogListByTag'
import WeblogDetail from './containers/WeblogDetail'
import Contact from './containers/Contact'
import Librairy from './containers/Librairy'
import Login from './containers/Login'
import Logout from './containers/Logout'
import ErrorPage from './components/ErrorPage'

import LibrairyPortfolio from './components/LibrairyPortfolio'
import LibrairyPost from './components/LibrairyPost'
import LibrairyCollection from './components/LibrairyCollection'
import LibrairyCollectionEnsemble from './components/LibrairyCollectionEnsemble'
import LibrairyAll from './components/LibrairyAll'
import LightboxStarter from './components/LightboxStarter'
import LibrairyPicturesList from './components/LibrairyPicturesList'
import LibrairyPictureDetail from './components/LibrairyPictureDetail'

function appendSlash(nextState, replace) {
  // add a slash at urls' end
  let url = nextState.location.pathname
  if (url.slice(-1) != "/") {
    replace(url + '/')
  }
}

export default () => {
  return (
    <Route>
      <Redirect from="/" to="/portfolio/" />
      <Redirect from="/weblog/page/1/" to="/weblog/" />
      <Route path="/" component={App} onEnter={appendSlash}>
        <Route component={WeblogWrapper}>
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
          <Route path="login(/)" component={Login} onEnter={appendSlash} />
          <Route path="logout(/)" component={Logout} onEnter={appendSlash} />
        </Route>
        <Route path="librairy(/)" component={Librairy} onEnter={appendSlash}>
          <Route path="portfolio/:slug(/)" component={LibrairyPortfolio} onEnter={appendSlash}>
            <IndexRoute component={LibrairyPicturesList} />
            <Route path="single/:picture(/)" component={LibrairyPictureDetail} />
          </Route>
          <Route path="post/:y/:m/:d/:slug(/)" component={LibrairyPost} onEnter={appendSlash}>
            <IndexRoute component={LibrairyPicturesList} />
            <Route path="single/:picture(/)" component={LibrairyPictureDetail} />
          </Route>
          <Route path="collection/:pk(/)" component={LibrairyCollection} onEnter={appendSlash}>
            <IndexRoute component={LibrairyPicturesList} />
            <Route path="single/:picture(/)" component={LibrairyPictureDetail} />
          </Route>
          <Route path="collection-ensemble/:pk(/)" component={LibrairyCollectionEnsemble} onEnter={appendSlash}>
            <IndexRoute component={LibrairyPicturesList} />
            <Route path="single/:picture(/)" component={LibrairyPictureDetail} />
          </Route>
          <Route path="all(/)" component={LibrairyAll} onEnter={appendSlash}>
            <IndexRoute component={LibrairyPicturesList} />
            <Route path="single/:picture(/)" component={LibrairyPictureDetail} />
          </Route>
        </Route>
        <Route component={WeblogWrapper}>
          <Route path="*" component={ErrorPage} />
        </Route>
      </Route>
    </Route>
  )
}
