import {
  REQUEST_SETTINGS,
  REQUEST_SETTINGS_SUCCESS,
  REQUEST_SETTINGS_FAILURE,
} from '../constants/actionsTypes'

function settings(state = {}, action) {
  switch (action.type) {
    case REQUEST_SETTINGS:
      return Object.assign({}, state, {
        is_fetching: true,
      })
    case REQUEST_SETTINGS_SUCCESS:
      return Object.assign({}, state, {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data
      )
    case REQUEST_SETTINGS_FAILURE:
      return Object.assign({}, state, {
        is_fetching: false,
        error: action.error
      })
    default:
      return state
  }
}

export default settings
