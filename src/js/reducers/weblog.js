import { combineReducers } from 'redux'

import {
  REQUEST_POSTS_HEADERS,
  REQUEST_POSTS_HEADERS_SUCCESS,
  REQUEST_POSTS_HEADERS_FAILURE,
  INVALIDATE_POST,
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
  POST_REMOVE_PICTURE,
  ORDER_POST_PICTURES,
  POST_DELETE,
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
    case INVALIDATE_POST:
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          did_invalidate: true
        })
      })
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
    case POST_REMOVE_PICTURE:
      // create new arry
      let pictures = state[action.post].pictures.slice()
      let index = pictures.indexOf(action.picture)
      if (index > -1 ) {
        // remove picture from it
        pictures.splice(index, 1)
      }
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          pictures: pictures
        })
      })
    case ORDER_POST_PICTURES:
      return Object.assign({}, state, {
        [action.post]: Object.assign({}, state[action.post], {
          pictures: action.new_order
        })
      })
    case POST_DELETE:
      // delete existing post from state
      new_state = Object.assign({}, state)
      delete new_state[action.post]

      return new_state
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

function headers(state = {fetched: false, data: []}, action) {
  switch (action.type) {
    case REQUEST_POSTS_HEADERS:
      return Object.assign({}, state, {
        is_fetching: true,
      })
    case REQUEST_POSTS_HEADERS_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        data: action.data,
        receivedAt: action.receivedAt
      })
    case REQUEST_POSTS_HEADERS_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.error
      })
    default:
      return state
  }
}

const weblog = combineReducers({
  headers,
  selectedPost,
  selectedPage,
  selectedPageByTag,
  posts,
  pages,
  pagesByTag,
})

export default weblog
