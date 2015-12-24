import { combineReducers } from 'redux'

import {
  LIGHTBOX_START,
  LIGHTBOX_STOP,
  LIGHTBOX_SET_CURRENT,
  LIGHTBOX_CURRENT_LOADED,
  LIGHTBOX_NEXT_LOADED,
  LIGHTBOX_PREVIOUS_LOADED,
  LIGHTBOX_TOOGLE_SLIDESHOW,
  LIGHTBOX_TOOGLE_PICT_INFO
} from '../constants/actionsTypes'

// boolean if lightbox is visible or not
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

// boolean if slideshow is enable or not
function slideshow(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_TOOGLE_SLIDESHOW:
      return ! state
    default:
      return state
  }
}

// contain list of all pictures pk
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

// contain current lightbox's main picture pk
function current(state = null, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return parseInt(action.picture) || null
    case LIGHTBOX_SET_CURRENT:
      return parseInt(action.picture) || null
    case LIGHTBOX_STOP:
      return null
    default:
      return state
  }
}

// boolean if pictures small info (title) are visible
// or not
function showInfo(state = true, action) {
  switch(action.type) {
    case LIGHTBOX_TOOGLE_PICT_INFO:
      return ! state
    default:
      return state
  }
}


function currentLoaded(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return false
    case LIGHTBOX_SET_CURRENT:
      return false
    case LIGHTBOX_STOP:
      return false
    case LIGHTBOX_CURRENT_LOADED:
      return true
    default:
      return state
  }
}


function nextLoaded(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return false
    case LIGHTBOX_SET_CURRENT:
      return false
    case LIGHTBOX_STOP:
      return false
    case LIGHTBOX_NEXT_LOADED:
      return true
    default:
      return state
  }
}


function previousLoaded(state = false, action) {
  switch(action.type) {
    case LIGHTBOX_START:
      return false
    case LIGHTBOX_SET_CURRENT:
      return false
    case LIGHTBOX_STOP:
      return false
    case LIGHTBOX_PREVIOUS_LOADED:
      return true
    default:
      return state
  }
}
const lightbox = combineReducers({
  activated,
  slideshow,
  showInfo,
  pictures,
  current,
  currentLoaded,
  nextLoaded,
  previousLoaded,
})

export default lightbox
