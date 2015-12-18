import { combineReducers } from 'redux'

import settings from './settings'
import modules from './modules'
import pictures from './pictures'
import portfolio from './portfolios'
import weblog from './weblog'
import contact from './contact'
import viewport from './viewport'
import common from './common'
import { routeReducer } from 'redux-simple-router'


const rootReducer = combineReducers({
  settings,
  modules,
  pictures,
  viewport,
  portfolio,
  weblog,
  contact,
  common,
  routing: routeReducer,
})

export default rootReducer
