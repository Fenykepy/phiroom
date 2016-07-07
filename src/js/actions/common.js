import * as types from '../constants/actionsTypes'

import {
  capitalize,
  isTrue,
} from '../helpers/utils'


export function buildDocumentTitle(state) {
  // return empty string if we have no state
  if (! state || ! state.common) {
    return ''
  }

  let title = state.common.settings.title
  let subtitle = state.common.settings.subtitle
  let module = capitalize(state.common.modules.current)
  let title_tail = state.common.title
  
  let items = [title, subtitle, module, title_tail]
  // return non empty values separate with dash 
  return isTrue(items).join(' - ') 
}


export function setDocumentTitleIfNeeded(title = '') {
  return function(dispatch, getState) {
    
    let state = getState()
    
    // store title tail in state
    if (state.common.title != title) {
      dispatch(setDocumentTitle(title))
      // refetch new state
      state = getState()
    }

    // if we are client side, we set document title if necessary
    if (state.common.viewport.clientSide) {
      let full_title = buildDocumentTitle(state)
      if (document.title != full_title) document.title = full_title
    }
  }
}

function setDocumentTitle(title) {
  return {
    type: types.DOCUMENT_SET_TITLE,
    title
  }
}


export function setDocumentAuthor(author) {
  return {
    type: types.DOCUMENT_SET_AUTHOR,
    author
  }
}

export function setDocumentDescription(description) {
  return {
    type: types.DOCUMENT_SET_DESCRIPTION,
    description
  }
}
