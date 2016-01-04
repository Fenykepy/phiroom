import { combineReducers } from 'redux'

import {
  SELECT_PICTURE,
  UNSELECT_PICTURE,
  UNSELECT_ALL,
  SET_PICTURES,
  LOGOUT
} from '../constants/actionsTypes'



function selected(state = [], action) {
  switch (action.type) {
    case SELECT_PICTURE:
      if (state.indexof(action.picture) > -1) {
        return state
      }
      return state.push(action.picture)
    case UNSELECT_PICTURE:
      let index = state.indexof(action.picture)
      if (index > -1) {
        return state.splice(index, 1)
      }
      return state
    case UNSELECT_ALL:
      return []
    case LOGOUT:
      return []
    default:
      return state
  }
}

function pictures(state = [], action) {
  switch (action.type) {
    case SET_PICTURES:
      return action.pictures
    case LOGOUT:
      return []
    default:
      return state
  }
}

const librairy = combineReducers({
  selected,
  pictures
})

export default librairy
