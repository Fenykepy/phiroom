import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'


// action creators

function requestCollectionsHeaders() {
  return {
    type: types.REQUEST_COLLECTIONS_HEADERS
  }
}

function receiveCollectionsHeaders(json) {
  return {
    type: types.REQUEST_COLLECTIONS_HEADERS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

function requestCollectionsHeadersFailure(error) {
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




function requestCollection(collection) {
  return {
    type: types.REQUEST_COLLECTION,
    collection
  }
}


function receiveCollection(collection, json) {
  return {
    type: types.REQUEST_COLLECTION_SUCCESS,
    collection,
    data: json,
    receivedAt: Date.now()
  }
}


function requestCollectionFailure(collection, error) {
  return {
    type: types.REQUEST_COLLECTION_FAILURE,
    collection,
    error
  }
}


export function orderCollectionPictures(collection, new_order) {
  return {
    type: types.ORDER_COLLECTION_PICTURES,
    collection,
    new_order
  }
}

export function invalidateCollection(collection) {
  return {
    type: types.INVALIDATE_COLLECTION,
    collection,
  }
}

export function invalidateCollectionHierarchy(collection) {
  // recursively invalidate collection's ensemble and all parents
  return (dispatch, getState) => {
    // invalidate given collection
    dispatch(invalidateCollection(collection))
    // invalidate ensemble if it's not root ensemble (pk=1)
    let ensemble = getState().librairy.collection.collections[collection].ensemble
    if (ensemble && ensemble > 1) {
      // TODO this fails when one of ancestors hasn't been fetched yet :/
      // an idea could be to unnest collections headers when they arrive
      // to populate collections and ensembles flat lists with headers
      dispatch(invalidateEnsemblesHierarchy(ensemble))
    }
  }
}


function shouldFetchCollection(state, collection) {
  // returns true if collection hasn't been fetched yet
  const item = state.librairy.collection.collections[collection]
  if (! item || item.did_invalidate) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}


function fetchCollection(collection) {
  // fetch a collection's data
  return function(dispatch) {
    // start request
    dispatch(requestCollection(collection))
    // return a promise
    return Fetch.get(`api/librairy/collections/${collection}/`)
      .then(json =>
          dispatch(receiveCollection(collection, json))
      )
      .catch(error =>
          dispatch(requestCollectionFailure(collection, error.message))
      )
  }
}


export function fetchCollectionIfNeeded(collection) {
  // fetch collection if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchCollection(getState(), collection)) {
      return dispatch(fetchCollection(collection))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
      {data: getState().librairy.collection.collections[collection]}
    ))
  }
}


function requestEnsemble(ensemble) {
  return {
    type: types.REQUEST_ENSEMBLE,
    ensemble
  }
}


function receiveEnsemble(ensemble, json) {
  return {
    type: types.REQUEST_ENSEMBLE_SUCCESS,
    ensemble,
    data: json,
    receivedAt: Date.now()
  }
}


function requestEnsembleFailure(ensemble, error) {
  return {
    type: types.REQUEST_ENSEMBLE_FAILURE,
    ensemble,
    error
  }
}


function shouldFetchCollectionEnsemble(state, ensemble) {
  // returns true if ensemble hasn't been fetched yet
  const item = state.librairy.collection.ensembles[ensemble]
  if (! item || item.did_invalidate) { return true }
  if (item.is_fetching || item.fetched) { return false }
  return true
}


function fetchCollectionEnsemble(ensemble) {
  // fetch a collection ensemble's data
  return function(dispatch) {
    // start request
    dispatch(requestEnsemble(ensemble))
    // return a promise
    return Fetch.get(`api/librairy/collection-ensembles/${ensemble}/`)
      .then(json =>
          dispatch(receiveEnsemble(ensemble, json))
      )
      .catch(error =>
          dispatch(requestEnsembleFailure(ensemble, error.message))
      )
  }
}


export function fetchCollectionEnsembleIfNeeded(ensemble) {
  // fetch a collection ensemble if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchCollectionEnsemble(getState(), ensemble)) {
      return dispatch(fetchCollectionEnsemble(ensemble))
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
      {data: getState().librairy.collection.ensembles[ensemble]}
    ))
  }
}


function invalidateCollectionEnsemble(ensemble) {
  return {
    type: types.INVALIDATE_ENSEMBLE,
    ensemble,
  }
}


export function invalidateEnsemblesHierarchy(ensemble) {
  // recursively invalidate collection ensembles and all parents
  return (dispatch, getState) => {
    // invalidate given ensemble
    dispatch(invalidateCollectionEnsemble(ensemble))
    // invalidate parent if it's not root ensemble (pk=1)
    parent = getState().librairy.collection.ensembles[ensemble].parent
    if (parent && parent > 1) {
      dispatch(invalidateEnsemblesHierarchy(parent))
    }
  }
}
