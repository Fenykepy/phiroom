import { combineReducers } from 'redux'

import {
  REQUEST_DESCRIPTION,
  REQUEST_DESCRIPTION_SUCCESS,
  REQUEST_DESCRIPTION_FAILURE
} from '../constants/actionsTypes'


function description(state = {}, action) {
  switch (action.type) {
    case REQUEST_DESCRIPTION:
      return Object.assign({}, state, {
          is_fetching: true,
          fetched: false
        }
      )
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
    default:
      return state
  }
}


const contact = combineReducers({
  description,
  message
})


export default contact
