import { combineReducers } from 'redux'

import {
  REQUEST_DESCRIPTION,
  REQUEST_DESCRIPTION_SUCCESS,
  REQUEST_DESCRIPTION_FAILURE,
  RESET_MESSAGE,
  REQUEST_POST_MESSAGE,
  REQUEST_POST_MESSAGE_SUCCESS,
  REQUEST_POST_MESSAGE_FAILURE
} from '../constants/actionsTypes'


function description(state = {}, action) {
  switch (action.type) {
    case REQUEST_DESCRIPTION:
      return Object.assign({}, state, {
          is_fetching: true,
          fetched: false
      })
    case REQUEST_DESCRIPTION_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        receivedAt: action.receivedAt
      },
      action.data)
    case REQUEST_DESCRIPTION_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.error
      })
    default:
      return state
  }
}


function message(state = {}, action) {
  switch (action.type) {
    case RESET_MESSAGE:
      return {}
    case REQUEST_POST_MESSAGE:
      return Object.assign({}, state, {
        is_posting: true,
        posted: false,
        errors: null
      })
    case REQUEST_POST_MESSAGE_SUCCESS:
      return Object.assign({}, state, {
        is_posting: false,
        posted: true,
        errors: null
      })
    case REQUEST_POST_MESSAGE_FAILURE:
      return Object.assign({}, state, {
        errors: action.errors
      })
    default:
      return state
  }
}


const contact = combineReducers({
  description,
  message
})


export default contact
