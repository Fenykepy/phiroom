import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'

// action creators


export function requestToken() {
  return {
    type: types.REQUEST_TOKEN
  }
}

export function receiveToken(token) {
  // store token to cookies here
  return {
    type: types.REQUEST_TOKEN_SUCCESS,
    token
  }
}

export function requestTokenFailure(error) {
  return {
    type: types.REQUEST_TOKEN_FAILURE,
    error
  }
}

export function logout() {
  return {
    type: types.LOGOUT
  }
}
