import * as types from '../constants/actionsTypes'

import { capitalize } from '../helpers/utils'


function buildDocumentTitle(state, title_tail) {
  let title = state.common.settings.title
  let subtitle = state.common.settings.subtitle
  let module = capitalize(state.common.modules.current)
  
  let base_title = `${title} - ${subtitle} - ${module}`
  if (title_tail) {
    base_title = `${base_title} - ${title_tail}`      
  }
  return base_title
}


export function setDocumentTitleIfNeeded(title = '') {
  return function(dispatch, getState) {
    let state = getState()
    let full_title = buildDocumentTitle(state, title)
    // set title if necessary
    if (full_title != document.title) { 
      if (state.common.viewport.clientSide) {
        // set document title if we are client side
        document.title = full_title
      }
      return dispatch(setDocumentTitle(title))
    }
  }
}

function setDocumentTitle(title) {
  return {
    type: types.DOCUMENT_SET_TITLE,
    title
  }
}
