import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'


// action creators


export function requestCSRFToken() {
  return {
    type: types.REQUEST_CSRF_TOKEN
  }
}


export function receiveCSRFToken(json) {
  return {
    type: types.REQUEST_CSRF_TOKEN_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}


export function requestCSRFTokenFailure(error) {
  return {
    type: types.REQUEST_CSRF_TOKEN_FAILURE,
    error
  }
}


function shouldFetchCSRFToken(state) {
  const csrf = state.common.csrfToken
  if (! csrf) { return true }
  if (csrf.is_fetching || csrf.fetched) { return false }
  return true
}

export function fetchCSRFTokenIfNeeded() {
  // fetch csrf token if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchCSRFToken(getState())) {
      return dispatch(fetchCSRFToken())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {}
    ))
  }
}


export function fetchCSRFToken() {
  /*
   * fetch csrf token
   */
  return function(dispatch) {
    // start request
    dispatch(requestCSRFToken())
    // return a promise
    return Fetch.get('api/token-csrf/')
      .then(json =>
          dispatch(receiveCSRFToken(json))
      )
      .catch(error =>
          dispatch(requestCSRFTokenFailure(error.message))
      )
  }
}
