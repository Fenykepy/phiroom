import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'



// action creators

export function requestShortPicture(picture) {
  return {
    type: types.REQUEST_SHORT_PICTURE,
    picture
  }
}

export function receiveShortPicture(picture, json) {
  return {
    type: types.REQUEST_SHORT_PICTURE_SUCCESS,
    picture,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestShortPictureFailure(picture, error) {
  return {
    type: types.REQUEST_SHORT_PICTURE_FAILURE,
    picture,
    error
  }
}



export function requestPicture(picture) {
  return {
    type: types.REQUEST_PICTURE,
    picture
  }
}

export function receivePicture(picture, json) {
  return {
    type: types.REQUEST_PICTURE_SUCCESS,
    picture,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPictureFailure(picture, error) {
  return {
    type: types.REQUEST_PICTURE_FAILURE,
    picture,
    error
  }
}


function shouldFetchShortPicture(state, picture) {
  const item = state.pictures.short[picture]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

function shouldFetchPicture(state, picture) {
  const item = state.pictures.full[picture]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchShortPictureIfNeeded(picture) {
  // fetch short picture if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchShortPicture(getState(), picture)) {
      return dispatch(fetchShortPicture(picture))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().pictures.short[picture]}
    ))
  }
}

export function fetchShortPicture(picture) {
  /*
   * fetch a picture's short data
   */
  return function(dispatch) {
    // start request
    dispatch(requestShortPicture(picture))
    // return a promise
    return Fetch.get(`api/librairy/pictures/${picture}/short/`)
      .then(json =>
          dispatch(receiveShortPicture(picture, json))
      )
      .catch(error =>
          dispatch(requestPictureFailure(picture, error.message))
      )
  }
}
