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

/* !!! add here contextual menu and notifications reducer */

const common = combineReducers({
  settings,
  modules,
  viewport,
  csrf,
  authors,
  user,
  lightbox,
  modal,
  pictures,
})

export default common
