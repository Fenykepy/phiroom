import { combineReducers } from 'redux'


import {
  REQUEST_COLLECTIONS_HEADERS,
  REQUEST_COLLECTIONS_HEADERS_SUCCESS,
  REQUEST_COLLECTIONS_HEADERS_FAILURE,
  REQUEST_COLLECTION,
  REQUEST_COLLECTION_SUCCESS,
  REQUEST_COLLECTION_FAILURE,
  COLLECTION_REMOVE_PICTURE,
  ORDER_COLLECTION_PICTURES,
  INVALIDATE_COLLECTION,
  REQUEST_CREATE_COLLECTION,
  REQUEST_CREATE_COLLECTION_SUCCESS,
  REQUEST_CREATE_COLLECTION_FAILURE,
  REQUEST_UPDATE_COLLECTION,
  REQUEST_UPDATE_COLLECTION_SUCCESS,
  REQUEST_UPDATE_COLLECTION_FAILURE,
  COLLECTION_EDIT_PREFILL,
  COLLECTION_EDIT_SET_NAME,
  COLLECTION_EDIT_SET_ENSEMBLE,
  COLLECTION_DELETE,
  REQUEST_ENSEMBLE,
  REQUEST_ENSEMBLE_SUCCESS,
  REQUEST_ENSEMBLE_FAILURE,
  REQUEST_CREATE_ENSEMBLE,
  REQUEST_CREATE_ENSEMBLE_SUCCESS,
  REQUEST_CREATE_ENSEMBLE_FAILURE,
  REQUEST_UPDATE_ENSEMBLE,
  REQUEST_UPDATE_ENSEMBLE_SUCCESS,
  REQUEST_UPDATE_ENSEMBLE_FAILURE,
  INVALIDATE_ENSEMBLE,
  ENSEMBLE_EDIT_PREFILL,
  ENSEMBLE_EDIT_SET_NAME,
  ENSEMBLE_EDIT_SET_PARENT,
  LOGOUT,
} from '../constants/actionsTypes'

function editedCollection(state = {}, action) {
  switch (action.type) {
    case COLLECTION_EDIT_PREFILL:
      return action.data
    case COLLECTION_EDIT_SET_NAME:
      return Object.assign({}, state, {
        name: action.name
      })
    case COLLECTION_EDIT_SET_ENSEMBLE:
      return Object.assign({}, state, {
        ensemble: action.ensemble
      })
    case REQUEST_CREATE_COLLECTION:
      return Object.assign({}, state, {
        is_posting: true,
        errors: {}
      })
    case REQUEST_CREATE_COLLECTION_SUCCESS:
      return {}
    case REQUEST_CREATE_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        is_posting: false,
        errors: action.errors
      })
    case REQUEST_UPDATE_COLLECTION:
      return Object.assign({}, state, {
        is_posting: true,
        errors: {}
      })
    case REQUEST_UPDATE_COLLECTION_SUCCESS:
      return {}
    case REQUEST_UPDATE_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        is_posting: false,
        errors: action.errors
      })
    default:
      return state
  }
}

function collections(state = {}, action) {
  let new_state
  switch (action.type) {
    case INVALIDATE_COLLECTION:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          did_invalidate: true
        })
      })
    case REQUEST_COLLECTION:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    case REQUEST_CREATE_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_UPDATE_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case COLLECTION_REMOVE_PICTURE:
      // create new array
      let pictures = state[action.collection].pictures.slice()
      let index = pictures.indexOf(action.picture)
      if (index > -1 ) {
        // remove picture from it
        pictures.splice(index, 1)
      }
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.collection], {
          picture: pictures
        })
      })
    case ORDER_COLLECTION_PICTURES:
      return Object.assign({}, state, {
        [action.collection]: Object.assign({}, state[action.portfolio], {
          pictures: action.new_order
        })
      })
    case COLLECTION_DELETE:
      // delete existing collection from state
      new_state = Object.assign({}, state)
      delete new_state[action.collection]
      
      return new_state
    default:
      return state
  }
}

function editedEnsemble(state = {}, action) {
  switch (action.type) {
    case ENSEMBLE_EDIT_PREFILL:
      return action.data
    case ENSEMBLE_EDIT_SET_NAME:
      return Object.assign({}, state, {
        name: action.name
      })
    case ENSEMBLE_EDIT_SET_PARENT:
      return Object.assign({}, state, {
        parent: action.parent
      })
    case REQUEST_CREATE_ENSEMBLE:
      return Object.assign({}, state, {
        is_posting: true,
        errors: {}
      })
    case REQUEST_CREATE_ENSEMBLE_SUCCESS:
      return {}
    case REQUEST_CREATE_ENSEMBLE_FAILURE:
      return Object.assign({}, state, {
        is_posting: false,
        errors: action.errors
      })
    case REQUEST_UPDATE_ENSEMBLE:
      return Object.assign({}, state, {
        is_posting: true,
        errors: {}
      })
    case REQUEST_UPDATE_ENSEMBLE_SUCCESS:
      return {}
    case REQUEST_UPDATE_ENSEMBLE_FAILURE:
      return Object.assign({}, state, {
        is_posting: false,
        errors: action.errors
      })
    default:
      return state
  }
}

function ensembles(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_ENSEMBLE:
      return Object.assign({}, state, {
        [action.ensemble]: Object.assign({}, state[action.ensemble], {
          did_invalidate: true
        })
      })
    case REQUEST_ENSEMBLE:
      return Object.assign({}, state, {
        [action.ensemble]: Object.assign({}, state[action.ensemble], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_ENSEMBLE_SUCCESS:
      return Object.assign({}, state, {
        [action.ensemble]: Object.assign({}, state[action.ensemble], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_ENSEMBLE_FAILURE:
      return Object.assign({}, state, {
        [action.ensemble]: Object.assign({}, state[action.ensemble], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    default:
      return state
  }
}

function headers(state = {}, action) {
  switch (action.type) {
    case REQUEST_COLLECTIONS_HEADERS:
      return Object.assign({}, state, {
        is_fetching: true,
      })
    case REQUEST_COLLECTIONS_HEADERS_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        data: action.data,
        receivedAt: action.receivedAt
      })
    case REQUEST_COLLECTIONS_HEADERS_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.erro
      })
    default:
      return state
  }
}

const collection = combineReducers({
  editedCollection,
  collections,
  editedEnsemble,
  ensembles,
  headers,
})

export default collection
