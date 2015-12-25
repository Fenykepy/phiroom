import * as types from '../constants/actionsTypes'


// action creators


export function lightboxStart(pictures, picture) {
  //console.log('start', pictures, picture)
  return {
    type: types.LIGHTBOX_START,
    pictures,
    picture
  }
}

export function lightboxSetCurrent(picture) {
  console.log('set current', picture)
  return {
    type: types.LIGHTBOX_SET_CURRENT,
    picture
  }
}

export function lightboxStop() {
  return {
    type: types.LIGHTBOX_STOP
  }
}

export function lightboxCurrentLoaded() {
  console.log('current loaded')
  return {
    type: types.LIGHTBOX_CURRENT_LOADED
  }
}

export function lightboxNextLoaded() {
  console.log('next loaded')
  return {
    type: types.LIGHTBOX_NEXT_LOADED
  }
}

export function lightboxPreviousLoaded() {
  console.log('previous loaded')
  return {
    type: types.LIGHTBOX_PREVIOUS_LOADED
  }
}
export function lightboxToogleSlideshow() {
  return {
    type: types.LIGHTBOX_TOOGLE_SLIDESHOW
  }
}

export function lightboxTooglePictInfo() {
  return {
    type: types.LIGHTBOX_TOOGLE_PICT_INFO
  }
}
