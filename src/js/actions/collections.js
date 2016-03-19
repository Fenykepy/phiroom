import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'


// action creators

export function requestCollectionsHeaders() {
  return {
    type: types.REQUEST_COLLECTIONS_HEADERS
  }
}

export function receiveCollectionsHeaders(json) {
  return {
    type: types.REQUEST_COLLECTIONS_HEADERS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestCollectionsHeadersFailure(error) {
  return {
    type: types.REQUEST_COLLECTIONS_HEADERS_FAILURE,
    error
  }
}

function shouldFetchCollectionsHeaders(state) {
  // returns true if headers haven't been fetched or are invalidate
  const headers = state.librairy.collection.headers
  if (! headers) { return true }
  if (headers.is_fetching || headers.fetched) { return false }
  return true
}


function fetchCollectionsHeaders() {
  // fetche collections headers
  return function(dispatch) {
    //start request
    dispatch(requestCollectionsHeaders())
    // return a promise
    return Fetch.get('api/librairy/collections/headers/')
      .then(json =>
        dispatch(receiveCollectionsHeaders(json))
      )
      .catch(error =>
        dispatch(requestCollectionsHeadersFailure(error.message))
      )
  }
}

export function fetchCollectionsHeadersIfNeeded() {
  // fetch collections headers if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchCollectionsHeaders(getState())) {
      return dispatch(fetchCollectionsHeaders())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve()) 
  }
}
