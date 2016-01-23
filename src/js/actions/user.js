import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'
import { setCookie, deleteCookie } from '../helpers/cookieManager'

// action creators

function requestToken() {
  return {
    type: types.REQUEST_TOKEN
  }
}

function receiveToken(token) {
  // store token to cookies here
  return {
    type: types.REQUEST_TOKEN_SUCCESS,
    token
  }
}

function requestTokenFailure(error) {
  return {
    type: types.REQUEST_TOKEN_FAILURE,
    error
  }
}

export function login(credentials) {
  /*
   * try to get token with given credentials
   */
  return function(dispatch) {
    // start request
    dispatch(requestToken())
    // return a promise
    return Fetch.post('api/token-auth/',
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        JSON.stringify(credentials)
      )
      .then(json => {
          // keep cookie with token for 7 days
          setCookie('auth_token', json.token, 7)
          dispatch(receiveToken(json.token))
      })
      .then(() =>
        // fetch authenticated user's data
        dispatch(fetchCurrentUserIfNeeded())
      )
      .catch(error => {
        console.warn(error)
        dispatch(requestTokenFailure(error.message))
      })
  }
}



function requestVerifyToken() {
  return {
    type: types.REQUEST_VERIFY_TOKEN
  }
}

function receivedVerifiedToken(token) {
  return {
    type: types.REQUEST_VERIFY_TOKEN_SUCCESS,
    token
  }
}

function requestVerifyTokenFailure(error) {
  return {
    type: types.REQUEST_VERIFY_TOKEN_FAILURE,
    error
  }
}

export function verifyToken(token) {
  /*
   * verify if given token is valid
   */
  return function(dispatch) {
    // start request
    dispatch(requestVerifyToken())
    // return a promise
    return Fetch.post('api/token-verify/',
        {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        JSON.stringify({'token': token})
      )
      .then(json =>
        dispatch(receivedVerifiedToken(json.token))
      )
      .then(() =>
        // fetch authenticated user's data
        dispatch(fetchCurrentUserIfNeeded())
      )
      .catch(error => {
        console.warn(error)
        dispatch(requestVerifyTokenFailure(error))
      })
  }
}




export function logout() {
  // we delete cookie here
  deleteCookie('auth_token')
  return {
    type: types.LOGOUT
  }
}

function requestCurrentUser() {
  return {
    type: types.REQUEST_CURRENT_USER
  }
}

function receiveCurrentUser(user) {
  return {
    type: types.REQUEST_CURRENT_USER_SUCCESS,
    user,
    receivedAt: Date.now()
  }
}

function requestCurrentUserFailure(error) {
  return {
    type: types.REQUEST_CURRENT_USER_FAILURE,
    error
  }
}

function shouldFetchCurrentUser(state) {
  const user = state.user
  if (! user.is_authenticated || user.is_fetching_user ||
      user.user_fetched) { return false }
  return true
}

export function fetchCurrentUserIfNeeded() {
  // fetch current user data if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchCurrentUser(getState())) {
      return dispatch(fetchCurrentUser())
    }
    // else, return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {}
    ))
  }
}

function fetchCurrentUser() {
  /*
   * fetch current (authenticated) user's data
   */
  return function(dispatch) {
    // start request
    dispatch(requestCurrentUser())
    // return a promise
    return Fetch.get('api/users/current/')
      .then(json =>
          dispatch(receiveCurrentUser(json))
      )
      .catch(error =>
          dispatch(requestCurrentUserFailure(error.message))
      )
  }
}
