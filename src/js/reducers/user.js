import { combineReducers } from 'redux'

import {
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_FAILURE,
  REQUEST_VERIFY_TOKEN,
  REQUEST_VERIFY_TOKEN_SUCCESS,
  REQUEST_VERIFY_TOKEN_FAILURE,
  LOGOUT
} from '../constants/actionsTypes'


function token(state = null, action) {
  switch (action.type) {
    case REQUEST_TOKEN_SUCCESS:
      return action.token
    case REQUEST_TOKEN_FAILURE:
      return null
    case REQUEST_VERIFY_TOKEN_SUCCESS:
      return action.token
    case REQUEST_VERIFY_TOKEN_FAILURE:
      return null
    case LOGOUT:
      return null
    default:
      return state
  }
}
/*
let state = {
  is_authenticated: false,
  fetched: false,
  is_fetching: false,
  is_fetching_token: false,
  token_fetched: false
  token: '',
  username: "fred",
	first_name: "",
	last_name: "",
	email: "",
	is_staff: true,
	avatar: null,
	author_name: "fred",
	website: null,
	facebook_link: null,
	flickr_link: null,
	px500_link: null,
	twitter_link: null,
	gplus_link: null,
	pinterest_link: null,
	vk_link: null,
	mail_newsletter: false
}
*/
function user(state = {}, action) {
	switch (action.type) {
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
