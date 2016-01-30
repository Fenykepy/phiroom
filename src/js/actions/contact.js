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


/***********************************/
/*         MESSAGE FORM            */
/***********************************/


export function resetMessage() {
  return {
    type: types.RESET_MESSAGE
  }
}



export function messageSetName(name) {
  return {
    type: types.CONTACT_MESSAGE_SET_NAME,
    name
  }
}

export function messageSetEmail(email) {
  return {
    type: types.CONTACT_MESSAGE_SET_EMAIL,
    mail
  }
}

export function messageSetWebsite(website) {
  return {
    type: types.CONTACT_MESSAGE_SET_WEBSITE,
    website
  }
}

export function messageSetSubject(subject) {
  return {
    type: types.CONTACT_MESSAGE_SET_SUBJECT,
    subject
  }
}

export function messageSetMessage(message) {
  return {
    type: types.CONTACT_MESSAGE_SET_MESSAGE,
    message
  }
}

export function messageSetForward(forward) {
  return {
    type: types.CONTACT_MESSAGE_SET_FORWARD,
    forward
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


export function postMessage() {
  /*
   * post a message
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestPostMessage())
    let state = getState()
    let msg = state.contact.message
    let data = {
      subject: msg.subject,
      message: msg.message,
      forward: msg.forward,
    }
    // if user is not authenticated, send more infos
    if (! state.user.is_authenticated) {
      data.name = message.name
      data.mail = message.mail
      data.website = message.website
    }

    // return a promise
    return Fetch.post('api/contact/messages/',
          {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          JSON.stringify(data)
        )
        .then(json =>
            dispatch(requestPostMessageSuccess())
        )
        .catch(error => {
            error.response.json().then(json => {
              // store error json in state
              dispatch(requestPostMessageFailure(json))
              // throw error to catch it in form and display it
              throw error
            })
        })
    }
}
