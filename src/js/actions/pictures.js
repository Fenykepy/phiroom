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
          dispatch(requestShortPictureFailure(picture, error.message))
      )
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

function shouldFetchPicture(state, picture) {
  const item = state.pictures[picture]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchPictureIfNeeded(picture) {
  // fetch picture if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPicture(getState(), picture)) {
      return dispatch(fetchPicture(picture))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().pictures[picture]}
    ))
  }
}

export function fetchPicture(picture) {
  /*
   * fetch a picture's data
   */
  return function(dispatch) {
    // start request
    dispatch(requestPicture(picture))
    // return a promise
    return Fetch.get(`api/librairy/pictures/${picture}/`)
      .then(json =>
          dispatch(receivePicture(picture, json))
      )
      /*.catch(error => {
          console.log(error)
          dispatch(requestPictureFailure(picture, error.message))
      })*/
  }
}

export function deletePicture(picture) {
  /*
   * delete a picture from server
   */
  Fetch.delete(`api/librairy/pictures/${picture}/`)
    .catch(error => {
      console.log(error)
    })
  return {
    type: types.DELETE_PICTURE,
    picture
  }
}




