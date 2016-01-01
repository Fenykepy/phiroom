import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'
import { setCookie, deleteCookie } from '../helpers/cookieManager'
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

export function requestVerifyToken() {
  return {
    type: types.REQUEST_VERIFY_TOKEN
  }
}

export function receivedVerifiedToken(token) {
  return {
    type: types.REQUEST_VERIFY_TOKEN_SUCCESS,
    token
  }
}

export function requestVerifyTokenFailure(error) {
  return {
    type: types.REQUEST_VERIFY_TOKEN_FAILURE,
    error
  }
}

export function logout() {
  // we delete cookie here
  deleteCookie('auth_token')
  return {
    type: types.LOGOUT
  }
}

export function verifyToken(token) {
  /*
   * verify if given token is valid
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestVerifyToken())
    let csrf_token = getState().common.csrfToken.token
    // return a promise
    return Fetch.post('api/token-verify/',
        {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf_token
        },
        JSON.stringify({'token': token})
      )
      .then(json =>
        dispatch(receivedVerifiedToken(json.token))
      )
      .catch(error => {
        console.warn(error)
        dispatch(requestVerifyTokenFailure(error))
      })
  }
}

export function login(credentials) {
  /*
   * try to get token with given credentials
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestToken())
    let state = getState()
    let csrf_token = state.common.csrfToken.token
    // return a promise
    return Fetch.post('api/token-auth/',
        {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf_token
        },
        JSON.stringify(credentials)
      )
      .then(json => {
          // keep cookie with token for 7 days
          setCookie('auth_token', json.token, 7)
          dispatch(receiveToken(json.token))
      })
      .catch(error => {
        console.warn(error)
        dispatch(requestTokenFailure(error.message))
      })
  }
}
