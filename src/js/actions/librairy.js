import * as types from '../constants/actionsTypes'
import { PICTURE } from '../constants/dragTypes'

import Fetch from '../helpers/http'

// action creators


export function setPictures(pictures) {
  return {
    type: types.SET_PICTURES,
    pictures
  }
}

export function selectPicture(picture) {
  return {
    type: types.SELECT_PICTURE,
    picture
  }
}

export function unselectPicture(picture) {
  return {
    type: types.UNSELECT_PICTURE,
    picture
  }
}

export function unselectAll() {
  return {
    type: types.UNSELECT_ALL,
  }
}

export function dragStart(type, data) {
  console.log(type, data)
  return {
    type: types.DRAG_START,
    drag_type: type,
    drag_data: data
  }
}

export function dragEnd() {
  return {
    type: types.DRAG_END
  }
}

export function addPicts2Portfolio(portfolio) {
  return (dispatch, getState) => {
    // get dragged elements from state
    let state = getState()
    let drag = state.librairy.drag
    if (drag.type === PICTURE) {
      // add pictures to portfolio
      console.log(portfolio)
      drag.data.map(item => {
        return Fetch.post('api/portfolio/portfolio-picture/',
          {
            'Content-Type': 'application/json',
            'X-CSRFToken': state.common.csrfToken.token
          },
          JSON.stringify({
            portfolio: portfolio,
            picture: item
          })
        )
        .then(json =>
            console.log(json)
        )
        .catch(error =>
            console.log(error.message)
        )
      })
    }
    return dispatch(dragEnd())
  }

}
