import { combineReducers } from 'redux'

import {
  REQUEST_CSRF_TOKEN,
  REQUEST_CSRF_TOKEN_SUCCESS,
  REQUEST_CSRF_TOKEN_FAILURE
} from '../constants/actionsTypes'



function csrf(state = {}, action) {
  switch (action.type) {
    case REQUEST_CSRF_TOKEN:
      return Object.assign({}, state, {
        is_fetching: true
      })
    case REQUEST_CSRF_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        token: action.data.token,
        receivedAt: action.receivedAt
      })
    case REQUEST_CSRF_TOKEN_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.error
      })
    default:
      return state
  }
}


export default csrf
