import { combineReducers } from 'redux'

import {
  SELECT_PICTURE,
  UNSELECT_PICTURE,
  UNSELECT_ALL,
  LIBRAIRY_SET_TITLE,
  SET_PICTURES,
  UNSET_PICTURE,
  ORDER_PORTFOLIO_PICTURES,
  ORDER_POST_PICTURES,
  SET_N_COLUMNS,
  DRAG_START,
  DRAG_END,
  LOGOUT
} from '../constants/actionsTypes'

import collection from './collections'

function title(state = null, action) {
  switch (action.type) {
    case LIBRAIRY_SET_TITLE:
      return action.title
    default:
      return state
  }
}

function selected(state = [], action) {
  switch (action.type) {
    case SET_PICTURES:
      /*
       * remove selected pictures which aren't
       * any more in displayed set
       */
      let selection = []
      state.map(item => {
        if (action.pictures.indexOf(item) > -1) {
          selection.push(item)
        }
      })
      return selection
    case SELECT_PICTURE:
      if (state.indexOf(action.picture) > -1) {
        return state
      }
      let newState = state.slice()
      newState.push(action.picture)
      return newState
    case UNSELECT_PICTURE:
      // duplicate state array
      let array = state.slice()
      let index = state.indexOf(action.picture)
      if (index > -1) {
        // remove unselected item from array
        array.splice(index, 1)
        return array
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
    case ORDER_PORTFOLIO_PICTURES:
      return action.new_order
    case ORDER_POST_PICTURES:
      return action.new_order
    case UNSET_PICTURE:
      // create a new array
      let pictures = state.slice()
      let index = pictures.indexOf(action.picture)
      if (index > -1) {
        // remove picture
        pictures.splice(index, 1)
      }
      return pictures
    case LOGOUT:
      return []
    default:
      return state
  }
}

function columns(state = 5, action) {
  switch (action.type) {
    case SET_N_COLUMNS:
      return action.number
    default:
      return state
  }
}

function left_panel_width(state = 300, action) {
  switch (action.type) {
    default:
      return state
  }
}

function right_panel_width(state = 0, action) {
  switch (action.type) {
    default:
      return state
  }
}

function drag(state = {}, action) {
  switch (action.type) {
    case DRAG_START:
      return {
        type: action.drag_type,
        data: action.drag_data
      }
    case DRAG_END:
      return {}
    case LOGOUT:
      return {}
    default:
      return state
  }
}


const librairy = combineReducers({
  selected,
  pictures,
  columns,
  left_panel_width,
  right_panel_width,
  drag,
  title,
  collection,
})

export default librairy
