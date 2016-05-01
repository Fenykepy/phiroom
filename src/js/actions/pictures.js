import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'
import { guid } from '../helpers/utils'



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
  const item = state.common.pictures.short[picture]
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

function shouldFetchPicture(state, picture) {
  const item = state.common.pictures.full[picture]
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
          {data: getState().common.pictures.short[picture]}
    ))
  }
}

export function fetchShortPicture(picture) {
  /*
   * fetch a picture's short data
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestShortPicture(picture))
    // return a promise
    return Fetch.get(`api/librairy/pictures/${picture}/short/`, getState())
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
  const item = state.common.pictures.full[picture]
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
          {data: getState().common.pictures[picture]}
    ))
  }
}

export function fetchPicture(picture) {
  /*
   * fetch a picture's data
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestPicture(picture))
    // return a promise
    return Fetch.get(`api/librairy/pictures/${picture}/`, getState())
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

  return function(dispatch, getState) {
    Fetch.delete(`api/librairy/pictures/${picture}/`, getState())
      /*.catch(error => {
        console.log(error)
      })*/
    return {
      type: types.DELETE_PICTURE,
      picture
    }
  }
}








function requestAllPictures() {
  return {
    type: types.REQUEST_ALL_PICTURES,
  }
}

function receiveAllPictures(json) {
  return {
    type: types.REQUEST_ALL_PICTURES_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

function requestAllPicturesFailure(error) {
  return {
    type: types.REQUEST_ALL_PICTURES_FAILURE,
    error
  }
}

function shouldFetchAllPictures(state) {
  const item = state.common.pictures.all
  if (! item) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}

export function fetchAllPicturesIfNeeded() {
  // fetch picture if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchAllPictures(getState())) {
      return dispatch(fetchAllPictures())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().common.pictures.all.pictures}
    ))
  }
}

function fetchAllPictures() {
  /*
   * fetch a picture's data
   */
  return function(dispatch) {
    // start request
    dispatch(requestAllPictures())
    // return a promise
    return Fetch.get('api/librairy/pictures/all/')
      .then(json =>
          dispatch(receiveAllPictures(json))
      )
      /*.catch(error => {
          console.log(error)
          dispatch(requestPictureFailure(picture, error.message))
      })*/
  }
}


function addPictureToUpload(file, import_uuid) {
  return {
    type: types.ADD_PICTURE_TO_UPLOAD,
    id: guid(),
    file,
    import_uuid,
  }
}

function uploadPictureRequest(id) {
  return {
    type: types.UPLOAD_PICTURE,
    id,
  }
}

function uploadPictureSuccess(id, data) {
  console.log('successfully uploaded picture: ' + id, data)
  return {
    type: types.UPLOAD_PICTURE_SUCCESS,
    id,
    data,
    receivedAt: Date.now()
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
    let uuid = guid()
    // add all files to upload list
    files.map(file => {
      dispatch(addPictureToUpload(file, uuid))
    })
    let uploading = getState().common.pictures.uploading
    if (! uploading.current) {
      // if no current uploading picture, start uploading
      dispatch(uploadPicture())
    }
  }
}

function uploadPicture() {
  /*
   * start uploading picture if any
   */
  return function(dispatch, getState) {
    let state = getState()
    let uploading = state.common.pictures.uploading
    let id = uploading.list[0]
    if (! id) {
      return
    }
    // start request
    dispatch(uploadPictureRequest(id))
    
    // create new form data with file
    let fd = new FormData()
    fd.append('file', uploading.files[id].file)
    Fetch.post('api/librairy/pictures/',
        state,
        {},
        fd
    )
    .then(json => {
      // trigger upload success
      dispatch(uploadPictureSuccess(id, json))
      // upload next pict if necessary
      dispatch(uploadPicture())
    })



  }
}
