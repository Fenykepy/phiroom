import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionsTypes'

import { base_url } from '../config'


// action creators


export function requestDescription() {
  return {
    type: types.REQUEST_DESCRIPTION
  }
}


export function receiveDescription(json) {
  return {
    type: types.REQUEST_DESCRIPTION_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}


export function requestDescriptionFailure(error) {
  return {
    type: types.REQUEST_DESCRIPTION_FAILURE,
    error
  }
}


function shouldFetchDescription(state) {
  const description = state.contact.description
  if (! description) { return true }
  if (description.is_fetching || description.fetched) { return false }
  return true
}


export function fetchDescriptionIfNeeded() {
  // fetch description if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchDescription(getState())) {
      return dispatch(fetchDescription())
    }
    // else, return a resolved promise
    return new Promise((resolve, reject) => resolve(
        {}
    ))
  }
}


export function fetchDescription() {
  /*
   * fetch contact page's description
   */
  return function(dispatch) {
    // start request
    dispatch(requestDescription())
    // return a promise
    return fetch(`${base_url}api/contact/description/`)
      .then(response =>
          response.json()
      )
      .then(json =>
          dispatch(receiveDescription(json))
      )
      .catch(error =>
          dispatch(requestDescriptionFailure(error.message))
      )
  }
}
