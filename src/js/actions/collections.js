import * as types from '../constants/actionsTypes'

import { browserHistory } from 'react-router'

import Fetch from '../helpers/http'

import { setTitle } from './librairy'
import { setDocumentTitleIfNeeded } from './common'


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
  return function(dispatch, getState) {
    //start request
    dispatch(requestCollectionsHeaders())
    // return a promise
    return Fetch.get('api/librairy/collections/headers/', getState())
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
  return function(dispatch, getState) {
    // start request
    dispatch(requestCollection(collection))
    // return a promise
    return Fetch.get(`api/librairy/collections/${collection}/`, getState())
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
  return function(dispatch, getState) {
    // start request
    dispatch(requestEnsemble(ensemble))
    // return a promise
    return Fetch.get(`api/librairy/collection-ensembles/${ensemble}/`,
      getState())
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


/*
 * Creating new collection
 */

function prefillCollectionForm(data = {}) {
  // start collection edition with given datas
  return {
    type: types.COLLECTION_EDIT_PREFILL,
    data: data
  }
}

export function newCollection() {
  // start collection edition with empty datas
  return function(dispatch) {
    return dispatch(prefillCollectionForm())
  }
}

export function editCollection(collection) {
  return function(dispatch) {
    return dispatch(fetchCollectionIfNeeded(collection))
      .then(data => {
        return dispatch(prefillCollectionForm({
          name: data.data.name,
          ensemble: data.data.ensemble,
          pk: collection,
        }))
      })
  }
}

export function collectionSetName(name) {
  return {
    type: types.COLLECTION_EDIT_SET_NAME,
    name
  }
}

export function collectionSetEnsemble(ensemble) {
  return {
    type: types.COLLECTION_EDIT_SET_ENSEMBLE,
    ensemble
  }
}

function requestCreateCollection() {
  return {
    type: types.REQUEST_CREATE_COLLECTION,
  }
}

function receiveNewCollection(json) {
  return {
    type: types.REQUEST_CREATE_COLLECTION_SUCCESS,
    collection: json.pk,
    data: json,
    receivedAt: Date.now()
  }
}

function requestCreateCollectionFailure(errors) {
  return {
    type: types.REQUEST_CREATE_COLLECTION_FAILURE,
    errors
  }
}

function getEditedCollectionData(state) {
  let collection = state.librairy.collection.editedCollection
  return {
    name: collection.name,
    ensemble: collection.ensemble
  }
}

export function createCollection() {
  return function(dispatch, getState) {
    dispatch(requestCreateCollection())
    let data = getEditedCollectionData(getState())

    return Fetch.post('api/librairy/collections/',
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      dispatch(receiveNewCollection(json))
      // navigate to updated collection
      browserHistory.push(`/librairy/collection/${json.pk}/`)
      // refetch new collections headers
      return dispatch(fetchCollectionsHeaders())
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestCreateCollectionFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}

/*
 * Updating existing collection
 */

function requestUpdateCollection() {
  return {
    type: types.REQUEST_UPDATE_COLLECTION,
  }
}

function receiveUpdatedCollection(collection, json) {
  return {
    type: types.REQUEST_UPDATE_COLLECTION_SUCCESS,
    collection: collection,
    data: json,
    receivedAt: Date.now()
  }
}

function requestUpdateCollectionFailure(errors) {
  return {
    type: types.REQUEST_UPDATE_COLLECTION_FAILURE,
    errors
  }
}

export function updateCollection(collection) {
  return function(dispatch, getState) {
    dispatch(requestUpdateCollection())
    let data = getEditedCollectionData(getState())

    return Fetch.patch(`api/librairy/collections/${collection}/`,
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch collections headers
      dispatch(fetchCollectionsHeaders())
      // set librairy title and document title
      dispatch(setTitle(json.name))
      dispatch(setDocumentTitleIfNeeded(json.name))
      return dispatch(receiveUpdatedCollection(collection, json))
    })
    .catch(error => {
      console.log(error)
      return error.response.json().then(json => {
        // store error json in state
        dispatch(requestUpdateCollectionFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    })
  }
}

/*
 * Deleting a collection
 */

export function deleteCollection(collection) {
  /*
   * delete a collection from server
   */
  return function(dispatch, getState) {
    Fetch.delete(`api/librairy/collections/${collection}/`,
      getState())
      .then(() => {
        dispatch(fetchCollectionsHeaders())
        // go to librairy root
        browserHistory.push('/librairy/')
      })

    // optimistically delete collection from state
    return {
      type: types.COLLECTION_DELETE,
      collection
    }
  }
}

/*
 * Creating new ensemble
 */

function prefillEnsembleForm(data = {}) {
  // start ensemble edition with given datas
  return {
    type: types.ENSEMBLE_EDIT_PREFILL,
    data: data
  }
}

export function newEnsemble() {
  // start ensemble edition with empty datas
  return function(dispatch) {
    return dispatch(prefillEnsembleForm())
  }
}

export function ensembleSetName(name) {
  return {
    type: types.ENSEMBLE_EDIT_SET_NAME,
    name
  }
}

export function ensembleSetParent(parent) {
  return {
    type: types.ENSEMBLE_EDIT_SET_PARENT,
    parent
  }
}

function requestCreateEnsemble() {
  return {
    type: types.REQUEST_CREATE_ENSEMBLE,
  }
}

function receiveNewEnsemble(json) {
  return {
    type: types.REQUEST_CREATE_ENSEMBLE_SUCCESS,
    ensemble: json.pk,
    data: json,
    receivedAt: Date.now()
  }
}

function requestCreateEnsembleFailure(errors) {
  return {
    type: types.REQUEST_CREATE_ENSEMBLE_FAILURE,
    errors
  }
}

function getEditedEnsembleData(state) {
  let ensemble = state.librairy.collection.editedEnsemble
  return {
    name: ensemble.name,
    parent: ensemble.parent
  }
}

export function createEnsemble() {
  return function(dispatch, getState) {
    dispatch(requestCreateEnsemble())
    let data = getEditedEnsembleData(getState())

    return Fetch.post('api/librairy/collection-ensembles/',
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      dispatch(receiveNewEnsemble(json))
      // navigate to updated collection
      browserHistory.push(`/librairy/collection-ensemble/${json.pk}/`)
      // refetch new collections headers
      return dispatch(fetchCollectionsHeaders())
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestCreateEnsembleFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}

/*
 * Updating existing ensemble
 */

export function editEnsemble(ensemble) {
  return function(dispatch) {
    return dispatch(fetchCollectionEnsembleIfNeeded(ensemble))
      .then(data => {
        return dispatch(prefillEnsembleForm({
          name: data.data.name,
          parent: data.data.parent,
          pk: ensemble,
        }))
      })
  }
}


function requestUpdateEnsemble() {
  return {
    type: types.REQUEST_UPDATE_ENSEMBLE,
  }
}

function receiveUpdatedEnsemble(ensemble, json) {
  return {
    type: types.REQUEST_UPDATE_ENSEMBLE_SUCCESS,
    ensemble: ensemble,
    data: json,
    receivedAt: Date.now()
  }
}

function requestUpdateEnsembleFailure(errors) {
  return {
    type: types.REQUEST_UPDATE_ENSEMBLE_FAILURE,
    errors
  }
}

export function updateEnsemble(ensemble) {
  return function(dispatch, getState) {
    dispatch(requestUpdateEnsemble())
    let data = getEditedEnsembleData(getState())

    return Fetch.patch(`api/librairy/collection-ensembles/${ensemble}/`,
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch collections headers
      dispatch(fetchCollectionsHeaders())
      // set librairy title and document title
      dispatch(setTitle(json.name))
      dispatch(setDocumentTitleIfNeeded(json.name))
      return dispatch(receiveUpdatedEnsemble(ensemble, json))
    })
    .catch(error => {
      return error.response.json().then(json => {
        // store error json in state
        dispatch(requestUpdateEnsembleFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    })
  }
}

/*
 * Deleting an ensemble
 */


export function deleteEnsemble(ensemble) {
  /*
   * delete a collection ensemble from server
   */
  return function(dispatch, getState) {
    Fetch.delete(`api/librairy/collection-ensembles/${ensemble}/`,
      getState())
      .then(() => {
        dispatch(fetchCollectionsHeaders())
        // go to librairy root
        browserHistory.push('/librairy/')

      })

    // optimistically delete ensemble from state
    return {
      type: types.ENSEMBLE_DELETE,
      ensemble
    }
  }
}
