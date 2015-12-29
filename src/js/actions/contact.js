import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'


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
    return Fetch.get('api/contact/description/')
      .then(json =>
          dispatch(receiveDescription(json))
      )
      .catch(error =>
          dispatch(requestDescriptionFailure(error.message))
      )
  }
}



export function resetMessage() {
  return {
    type: types.RESET_MESSAGE
  }
}


export function requestPostMessage() {
  return {
    type: types.REQUEST_POST_MESSAGE
  }
}


export function requestPostMessageSuccess() {
  return {
    type: types.REQUEST_POST_MESSAGE_SUCCESS
  }
}

export function requestPostMessageFailure(errors) {
  return {
    type: types.REQUEST_POST_MESSAGE_FAILURE,
    errors
  }
}


export function postMessage(data) {
  /*
   * post a message
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestPostMessage())
    let state = getState()
    let csrf_token = state.common.csrfToken.token

    // return a promise
    return Fetch.post('api/contact/messages/',
          {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token
          },
          JSON.stringify(data)
        )
        .then(json =>
            dispatch(requestPostMessageSuccess())
        )
        .catch(error => {
            console.log(errors)
            dispatch(requestPostMessageFailure(error.message))
          }
        )
    }
}
