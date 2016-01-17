import { combineReducers } from 'redux'

import {
  REQUEST_PICTURE,
  REQUEST_PICTURE_SUCCESS,
  REQUEST_PICTURE_FAILURE,
  REQUEST_SHORT_PICTURE,
  REQUEST_SHORT_PICTURE_SUCCESS,
  REQUEST_SHORT_PICTURE_FAILURE,
  REQUEST_PICTURES_PKS,
  REQUEST_PICTURES_PKS_SUCCESS,
  REQUEST_PICTURES_PKS_FAILURE,
  DELETE_PICTURE,
  LOGOUT,
} from '../constants/actionsTypes'


function short (state = {}, action) {
  switch (action.type) {
    case REQUEST_SHORT_PICTURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_SHORT_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_SHORT_PICTURE_FAILURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    case DELETE_PICTURE:
      let new_state = Object.assign({}, state)
      delete new_state[action.picture]
      return new_state
    default:
      return state
  }
}

function full (state = {}, action) {
  switch (action.type) {
    case REQUEST_PICTURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_PICTURE_FAILURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    case DELETE_PICTURE:
      let new_state = Object.assign({}, state)
      delete new_state[action.picture]
      return new_state
    case LOGOUT:
      return {}
    default:
      return state
  }
}

function all (state = {}, action) {
  switch (action.type) {
    case REQUEST_PICTURES_PKS:
      return Object.assign({}, state, {
        is_fetching: true,
        fetched: false
      })
    case REQUEST_PICTURES_PKS_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        pks: action.data
      })
    case REQUEST_PICTURES_PKS_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: false,
        error: action.error
      })
    case LOGOUT:
      return {}
    default:
      return state
  }
}

const pictures = combineReducers({
  short,
  full,
  all,
})

export default pictures
