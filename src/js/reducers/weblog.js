import { combineReducers } from 'redux'

import {
  REQUEST_WEBLOG_PAGE,
  REQUEST_WEBLOG_PAGE_FAILURE,
  REQUEST_WEBLOG_PAGE_SUCCESS,
  SELECT_WEBLOG_PAGE,
  REQUEST_POST,
  REQUEST_POST_FAILURE,
  REQUEST_POST_SUCCESS,
  SELECT_POST,
  REQUEST_WEBLOG_PAGE_BYTAG,
  REQUEST_WEBLOG_PAGE_BYTAG_FAILURE,
  REQUEST_WEBLOG_PAGE_BYTAG_SUCCESS,
  SELECT_WEBLOG_PAGE_BYTAG,
} from '../constants/actionsTypes'


function selectedPost(state = null, action) {
  switch (action.type) {
    case SELECT_POST:
      return action.post || null
    default:
      return state
  }
}

function selectedPage(state = null, action) {
  switch (action.type) {
    case SELECT_WEBLOG_PAGE:
      return action.page || null
    default:
      return state
  }
}

function posts(state = {}, action) {
  switch (action.type) {
    case REQUEST_POST:
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_POST_SUCCESS:
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_POST_FAILURE:
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    default:
      return state
  }
}

function pages(state = {}, action) {
  switch (action.type) {
    case REQUEST_WEBLOG_PAGE:
      return Object.assign({}, state, {
        [action.page]: Object.assign({}, state[action.page], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_WEBLOG_PAGE_SUCCESS:
      return Object.assign({}, state, {
        [action.page]: Object.assign({}, state[action.page], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_WEBLOG_PAGE_FAILURE:
      return Object.assign({}, state, {
        [action.page]: Object.assign({}, state[action.page], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    default:
      return state
  }
}

function selectedPageByTag(state = null, action) {
  switch (action.type) {
    case SELECT_WEBLOG_PAGE_BYTAG:
      return Object.assign({}, {
        tag: action.tag || null,
        page: action.page || null,
      })
    default:
      return state
  }
}

function pagesByTag(state = {}, action) {
  switch (action.type) {
    case REQUEST_WEBLOG_PAGE_BYTAG:
      let page = state[action.tag] ? state[action.tag][action.page] : {}
      return Object.assign({}, state, {
        [action.tag]: Object.assign({}, state[action.tag], {
          [action.page]: Object.assign({}, page, {
            is_fetching: true,
            fetched: false
          })
        })
      })
    case REQUEST_WEBLOG_PAGE_BYTAG_SUCCESS:
      return Object.assign({}, state, {
        [action.tag]: Object.assign({}, state[action.tag], {
          [action.page]: Object.assign({}, state[action.tag][action.page], {
            is_fetching: false,
            fetched: true,
            receivedAt: action.receivedAt
          },
          action.data)
        })
      })
    case REQUEST_WEBLOG_PAGE_BYTAG_FAILURE:
      return Object.assign({}, state, {
        [action.tag]: Object.assign({}, state[action.tag], {
          [action.page]: Object.assign({}, state[action.tag][action.page], {
            is_fetching: false,
            fetched: false,
            error: action.error
          })
        })
      })
    default:
      return state
  }
}

const weblog = combineReducers({
  selectedPost,
  selectedPage,
  selectedPageByTag,
  posts,
  pages,
  pagesByTag,
})

export default weblog
