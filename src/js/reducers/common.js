import { combineReducers } from 'redux'

import { DOCUMENT_SET_TITLE } from '../constants/actionsTypes'

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

function title(state = '', action) {
  switch (action.type) {
    case DOCUMENT_SET_TITLE:
      return action.title
    default:
      return state
  }
}

const common = combineReducers({
  title,
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
