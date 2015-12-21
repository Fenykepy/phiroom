import {
  REQUEST_AUTHOR,
  REQUEST_AUTHOR_SUCCESS,
  REQUEST_AUTHOR_FAILURE
} from '../constants/actionsTypes'


function authors(state = {}, action) {
  switch(action.type) {
    case REQUEST_AUTHOR:
      return Object.assign({}, state, {
        [action.author]: Object.assign({}, state[action.author], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_AUTHOR_SUCCESS:
      return Object.assign({}, state, {
        [action.author]: Object.assign({}, state[action.author], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_AUTHOR_FAILURE:
      return Object.assign({}, state, {
        [action.author]: Object.assign({}, state[action.author], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    default:
      return state
  }
}

export default authors
