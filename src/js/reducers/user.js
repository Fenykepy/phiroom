import { combineReducers } from 'redux'

import {
  REQUEST_CURRENT_USER,
  REQUEST_CURRENT_USER_SUCCESS,
  REQUEST_CURRENT_USER_FAILURE,
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_FAILURE,
  REQUEST_VERIFY_TOKEN,
  REQUEST_VERIFY_TOKEN_SUCCESS,
  REQUEST_VERIFY_TOKEN_FAILURE,
  LOGOUT
} from '../constants/actionsTypes'


function user(state = {}, action) {
	switch (action.type) {
    case REQUEST_CURRENT_USER:
      return Object.assign({}, state, {
        is_fetching_user: true,
        user_fetched: false
      })
    case REQUEST_CURRENT_USER_SUCCESS:
      return Object.assign({}, state, {
        is_fetching_user: false,
        user_fetched: true
      },
      action.user)
    case REQUEST_CURRENT_USER_FAILURE:
      return Object.assign({}, state, {
        is_fetching_user: false,
        user_fetched: false
      })
    case REQUEST_TOKEN:
      return Object.assign({}, state, {
        is_fetching_token: true,
        token_fetched: false
      })
    case REQUEST_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        is_authenticated: true,
        if_fetching_token: false,
        token_fetched: true,
        token: action.token
      })
    case REQUEST_TOKEN_FAILURE:
      return Object.assign({}, state, {
        is_fetching_token: false,
        token_fetched: false
      })
    case REQUEST_VERIFY_TOKEN:
      return Object.assign({}, state, {
        is_verifying_token: true,
        is_authenticated: false,
      })
    case REQUEST_VERIFY_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        is_verifying_token: false,
        is_authenticated: true,
      })
    case REQUEST_VERIFY_TOKEN_FAILURE:
      return Object.assign({}, state, {
        is_verifying_token: false,
        is_authenticated: false,
      })
    case LOGOUT:
      return {}
    default:
      return state
	}
}

export default user