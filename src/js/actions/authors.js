import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'

// action creators


export function requestAuthor(author) {
  return {
    type: types.REQUEST_AUTHOR,
    author
  }
}

export function receiveAuthor(author, json) {
  return {
    type: types.REQUEST_AUTHOR_SUCCESS,
    author,
    data: json,
    receivedAd: Date.now()
  }
}

export function requestAuthorFailure(author, error) {
  return {
    type: types.REQUEST_AUTHOR_FAILURE,
    author,
    error
  }
}


function shouldFetchAuthor(state, author) {
  // returns true if author hasn't been fetched yet
  const item = state.common.authors[author]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchAuthorIfNeeded(author) {
  // fetch author if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchAuthor(getState(), author)) {
      return dispatch(fetchAuthor(author))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
      {data: getState().common.authors[author]}
    ))
  }
}

function fetchAuthor(author) {
  /*
   * Fetch a user's author's datas
   */
  return function (dispatch, getState) {
    // start request
    dispatch(requestAuthor(author))
    // return a promise
    return Fetch.get(`api/users/author/${author}/`, getState())
      .then(json =>
        dispatch(receiveAuthor(author, json))
      )
      .catch(error =>
        dispatch(requestAuthorFailure(author, error.message))
      )
  }
}
