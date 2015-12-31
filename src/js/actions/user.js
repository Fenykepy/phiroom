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

export function login(credentials) {
  /*
   * try to get token with given credentials
   */
  return function(dispatch, getState()) {
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
      .then(json =>
          dispatch(receiveToken(token))
      )
      .catch(error => {
        console.warn(errors)
        dispatch(requestTokenFailure(error.message))
      })
  }
}
