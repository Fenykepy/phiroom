import { combineReducers } from 'redux'

import {
  REQUEST_PICTURE,
  REQUEST_PICTURE_SUCCESS,
  REQUEST_PICTURE_FAILURE,
  REQUEST_PICTURE_HITS,
  REQUEST_SHORT_PICTURE,
  REQUEST_SHORT_PICTURE_SUCCESS,
  REQUEST_SHORT_PICTURE_FAILURE,
  REQUEST_ALL_PICTURES,
  REQUEST_ALL_PICTURES_SUCCESS,
  REQUEST_ALL_PICTURES_FAILURE,
  ADD_PICTURE_TO_UPLOAD,
  UPLOAD_PICTURE,
  UPLOAD_PICTURE_SUCCESS,
  UPLOAD_PICTURE_FAILURE,
  DELETE_PICTURE,
  PICTURE_SET_TITLE,
  LOGOUT,
} from '../constants/actionsTypes'


function short (state = {}, action) {
  switch (action.type) {
    case REQUEST_SHORT_PICTURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_SHORT_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_SHORT_PICTURE_FAILURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    case DELETE_PICTURE:
      let new_state = Object.assign({}, state)
      delete new_state[action.picture]
      return new_state
    case PICTURE_SET_TITLE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          title: action.title,
        })
      })
    default:
      return state
  }
}

function full (state = {}, action) {
  switch (action.type) {
    case REQUEST_PICTURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_PICTURE_FAILURE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    case UPLOAD_PICTURE_SUCCESS:
      return Object.assign({}, state, {
        [action.data.sha1]: Object.assign({}, action.data, {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        })
      })
    case DELETE_PICTURE:
      let new_state = Object.assign({}, state)
      delete new_state[action.picture]
      return new_state
    case PICTURE_SET_TITLE:
      return Object.assign({}, state, {
        [action.picture]: Object.assign({}, state[action.picture], {
          title: action.title,
        })
      })
    case LOGOUT:
      return {}
    default:
      return state
  }
}


function hits(state = {}, action) {
  switch (action.type) {
    case REQUEST_PICTURE_HITS:
        return Object.assign({}, state, {
          [action.picture]: action.hits
        })
    case LOGOUT:
        return {}
    default:
        return state
  }
}



function all (state = {}, action) {
  switch (action.type) {
    case REQUEST_ALL_PICTURES:
      return Object.assign({}, state, {
        is_fetching: true,
        fetched: false
      })
    case REQUEST_ALL_PICTURES_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        receivedAt: action.receivedAt,
        pictures: action.data
      })
    case REQUEST_ALL_PICTURES_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: false,
        error: action.error
      })
    case UPLOAD_PICTURE_SUCCESS:
      // add new picture to all pictures array
      let pictures = []
      if (state.pictures) pictures = state.pictures.slice()
      pictures.unshift(action.data.sha1)
      return Object.assign({}, state, {
        pictures: pictures,
      })
    case LOGOUT:
      return {}
    default:
      return state
  }
}

function list(state = [], action) {
  /*
   * We upload pictures one after another
   * when a picture must be uploaded, it's added to array
   * when it starts uploading, it's removed from array
   * action creator loop on they array to upload all files
   */
  let new_state
  switch (action.type) {
    case ADD_PICTURE_TO_UPLOAD:
      new_state = state.slice()
      new_state.push(action.id)
      return new_state
    case UPLOAD_PICTURE:
      // create a new array
      new_state = state.slice()
      let index = new_state.indexOf(action.id)
      if (index > -1) {
        // remove id
        new_state.splice(index, 1)
      }
      return new_state
    default:
      return state
  }
}

function current (state = null, action) {
  /*
   * currently uploading picture
   */
  switch (action.type) {
    case UPLOAD_PICTURE:
      return action.id
    case UPLOAD_PICTURE_SUCCESS:
      return null
    case UPLOAD_PICTURE_FAILURE:
      return null
    default:
      return state
  }
}

function files(state = {}, action) {
  switch (action.type) {
    case ADD_PICTURE_TO_UPLOAD:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          uploading: false,
          file: action.file,
          import_uuid: action.import_uuid
        })
      })
    case UPLOAD_PICTURE:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          uploading: true,
        })
      })
    case UPLOAD_PICTURE_SUCCESS:
      // we don't need file any more
      let new_state = Object.assign({}, state)
      delete new_state[action.id]
      return new_state
    case UPLOAD_PICTURE_FAILURE:
      return Object.assign({}, state, {
        [action.id]: Object.assign({}, state[action.id], {
          uploading: false,
          error: action.error
        })
      })
    default:
      return state
  }
}

const uploading = combineReducers({
  files,
  current,
  list,
})


const pictures = combineReducers({
  short,
  full,
  all,
  hits,
  uploading,
})

export default pictures
