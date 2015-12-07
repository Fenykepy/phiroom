import { combineReducers } from 'redux'

import {
  REQUEST_PICTURE,
  REQUEST_PICTURE_SUCCESS,
  REQUEST_PICTURE_FAILURE,
  REQUEST_SHORT_PICTURE,
  REQUEST_SHORT_PICTURE_SUCCESS,
  REQUEST_SHORT_PICTURE_FAILURE,
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
    default:
      return state
  }
}

const pictures = combineReducers({
  short,
  full
})

export default pictures
