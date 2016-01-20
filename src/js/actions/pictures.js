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
  const item = state.pictures.full[picture]
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








export function requestPicturesPks() {
  return {
    type: types.REQUEST_PICTURES_PKS,
  }
}

export function receivePicturesPks(json) {
  return {
    type: types.REQUEST_PICTURES_PKS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPicturesPksFailure(error) {
  return {
    type: types.REQUEST_PICTURES_PKS_FAILURE,
    error
  }
}

function shouldFetchPicturesPks(state) {
  const item = state.pictures.all
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchPicturesPksIfNeeded() {
  // fetch picture if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPicturesPks(getState())) {
      return dispatch(fetchPicturesPks())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().pictures.all.pks}
    ))
  }
}

export function fetchPicturesPks() {
  /*
   * fetch a picture's data
   */
  return function(dispatch) {
    // start request
    dispatch(requestPicturesPks())
    // return a promise
    return Fetch.get('api/librairy/pictures/all/')
      .then(json =>
          dispatch(receivePicturesPks(json))
      )
      /*.catch(error => {
          console.log(error)
          dispatch(requestPictureFailure(picture, error.message))
      })*/
  }
}


function addPictureToUpload(file, import_uuid) {
  // generate file id
  return {
    type: types.ADD_PICTURE_TO_UPLOAD,
    id,
    file,
    import_uuid,
  }
}

function uploadPicture(id) {
  return {
    type: types.UPLOAD_PICTURE,
    id,
  }
}

function uploadPictureSuccess(id, data) {
  return {
    type: types.UPLOAD_PICTURE_SUCCESS,
    id,
    data
  }
}

function uploadPictureFailure(id, error) {
  return {
    type: types.UPLOAD_PICTURE_FAILURE,
    id,
    error
  }
}

export function uploadPictures(files) {
  /*
   * Launch an importation
   */
  return function(dispatch, getState) {
    // set a UUID for importation
  }
}

