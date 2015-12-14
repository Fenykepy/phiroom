import * as types from '../constants/actionsTypes'

// action creators


export function setModule(module) {
  return {
    type: types.SET_MODULE,
    module
  }
}
