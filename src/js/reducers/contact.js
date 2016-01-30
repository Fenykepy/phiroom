import { combineReducers } from 'redux'

import {
  REQUEST_DESCRIPTION,
  REQUEST_DESCRIPTION_SUCCESS,
  REQUEST_DESCRIPTION_FAILURE,
  RESET_MESSAGE,
  REQUEST_POST_MESSAGE,
  REQUEST_POST_MESSAGE_SUCCESS,
  REQUEST_POST_MESSAGE_FAILURE,
  CONTACT_MESSAGE_SET_NAME,
  CONTACT_MESSAGE_SET_EMAIL,
  CONTACT_MESSAGE_SET_WEBSITE,
  CONTACT_MESSAGE_SET_SUBJECT,
  CONTACT_MESSAGE_SET_MESSAGE,
  CONTACT_MESSAGE_SET_FORWARD,
  LOGOUT,
} from '../constants/actionsTypes'


function description(state = {}, action) {
  switch (action.type) {
    case REQUEST_DESCRIPTION:
      return Object.assign({}, state, {
          is_fetching: true,
          fetched: false
      })
    case REQUEST_DESCRIPTION_SUCCESS:
      return Object.assign({}, state, {
        is_fetching: false,
        fetched: true,
        receivedAt: action.receivedAt
      },
      action.data)
    case REQUEST_DESCRIPTION_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.error
      })
    default:
      return state
  }
}


function message(state = {}, action) {
  switch (action.type) {
    case RESET_MESSAGE:
      return {}
    case CONTACT_MESSAGE_SET_NAME:
      return Object.assign({}, state, {
        name: action.name
      })
    case CONTACT_MESSAGE_SET_EMAIL:
      return Object.assign({}, state, {
        mail: action.mail
      })
    case CONTACT_MESSAGE_SET_WEBSITE:
      return Object.assign({}, state, {
        website: action.website
      })
    case CONTACT_MESSAGE_SET_SUBJECT:
      return Object.assign({}, state, {
        subject: action.subject
      })
    case CONTACT_MESSAGE_SET_MESSAGE:
      return Object.assign({}, state, {
        message: action.message
      })
    case CONTACT_MESSAGE_SET_FORWARD:
      return Object.assign({}, state, {
        forward: action.forward
      })
    case REQUEST_POST_MESSAGE:
      return Object.assign({}, state, {
        is_posting: true,
        posted: false,
        errors: null
      })
    case REQUEST_POST_MESSAGE_SUCCESS:
      return Object.assign({}, state, {
        is_posting: false,
        posted: true,
        errors: null
      })
    case REQUEST_POST_MESSAGE_FAILURE:
      return Object.assign({}, state, {
        is_posting: false,
        errors: action.errors
      })
    case LOGOUT:
      return {}
    default:
      return state
  }
}


const contact = combineReducers({
  description,
  message
})


export default contact
