import { combineReducers } from 'redux'


import {
  REQUEST_COLLECTIONS_HEADERS,
  REQUEST_COLLECTIONS_HEADERS_SUCCESS,
  REQUEST_COLLECTIONS_HEADERS_FAILURE,
} from '../constants/actionsTypes'


function collections(state = {}, action) {
  switch (action.type) {
    default:
      return state
  }
}

function ensembles(state = {}, action) {
  switch (action.type) {
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
