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
  REQUEST_ENSEMBLE,
  REQUEST_ENSEMBLE_SUCCESS,
  REQUEST_ENSEMBLE_FAILURE,
} from '../constants/actionsTypes'


function collections(state = {}, action) {
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
    default:
      return state
  }
}

function ensembles(state = {}, action) {
  switch (action.type) {
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
  collections,
  ensembles,
  headers,
})

export default collection
