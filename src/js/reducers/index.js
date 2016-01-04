import { combineReducers } from 'redux'

import settings from './settings'
import modules from './modules'
import pictures from './pictures'
import portfolio from './portfolios'
import weblog from './weblog'
import contact from './contact'
import viewport from './viewport'
import common from './common'
import authors from './authors'
import lightbox from './lightbox'
import user from './user'
import librairy from './librairy'
import { routeReducer } from 'redux-simple-router'


const rootReducer = combineReducers({
  settings,
  authors,
  modules,
  pictures,
  viewport,
  portfolio,
  weblog,
  contact,
  common,
  lightbox,
  user,
  librairy,
  routing: routeReducer,
})

export default rootReducer
