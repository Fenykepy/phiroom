import * as types from '../constants/actionsTypes';

// action creators
export function setViewport(size) {
  return {
    type: types.SET_VIEWPORT,
    width: size.width,
    height: size.height
  }
}
