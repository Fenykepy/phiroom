import { SET_VIEWPORT } from '../constants/actionsTypes.js'


const initialState = {
  clientSide: false,
  width: null,
  height: null,
}

export default function viewport(state = initialState, action) {
  switch (action.type) {
    case SET_VIEWPORT:
      return Object.assign({}, state, {
        width: action.width,
        height: action.height,
        clientSide: true,
      })
    default:
      return state
  }
}
