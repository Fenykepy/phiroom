import * as types from '../constants/actionsTypes'


// action creators


export function lightboxStart(pictures, current) {
  return {
    type: types.LIGHTBOX_START,
    pictures,
    current
  }
}

export function lightboxNavTo(sha1) {
  return {
    type: types.LIGHTBOX_NAV_TO,
    sha1
  }
}

export function lightboxStop() {
  return {
    type: types.LIGHTBOX_STOP
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
