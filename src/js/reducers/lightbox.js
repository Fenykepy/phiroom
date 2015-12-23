import { combineReducers } from 'redux'

import {
  LIGHTBOX_START,
  LIGHTBOX_STOP,
  LIGHTBOX_PREV,
  LIGHTBOX_NEXT,
  LIGHTBOX_TOOGLE_SLIDESHOW,
  LIGHTBOX_TOOGLE_PICT_INFO
} from '../constants/actionsTypes'


function activated(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return true
    case LIGHTBOX_STOP:
      return false
    default:
      return state
  }
}

function slideshow(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_TOOGLE_SLIDESHOW:
      return ! state
    default:
      return state
  }
}

function pictures(state = [], action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return action.pictures
    case LIGHTBOX_STOP:
      return []
    default:
      return state
  }
}

function current(state = null, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return action.current
    case LIGHTBOX_STOP:
      return null
    default:
      return state
  }
}

function showInfo(state = true, action) {
  switch(action.type) {
    case LIGHTBOX_TOOGLE_PICT_INFO:
      return ! state
    default:
      return state
  }
}


const lightbox = combineReducers({
  activated,
  slideshow,
  showInfo,
  pictures,
  current
})

export default lightbox
