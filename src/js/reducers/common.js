import { combineReducers } from 'redux'

import settings from './settings'
import modules from './modules'
import viewport from './viewport'
import csrf from './csrf'
import authors from './authors'
import user from './user'
import lightbox from './lightbox'
import modal from './modal'
import pictures from './pictures'
import { routeReducer } from 'redux-simple-router'

/* !!! add here contextual menu and notifications reducer */

const commonReducer = combineReducers({
  settings,
  modules,
  viewport,
  csrf,
  authors,
  user,
  lightbox,
  modal,
  pictures,
  routing: routeReducer,
})
