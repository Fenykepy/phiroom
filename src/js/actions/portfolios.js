import * as types from '../constants/actionsTypes';

// action creators
export function displayPortfolio(portfolio) {
  return {type: types.DISPLAY_PORTFOLIO, portfolio}
}

export function nextPict() {
  return { type: types.NEXT_PICT }
}

export function prevPict() {
  return { type: types.PREV_PICT }
}

export function toggleSlideshow() {
  return { type: types.TOGGLE_SLIDESHOW }
}

export function toggleLightbox() {
  return { type: types.TOGGLE_LIGHTBOX }
}

export function togglePictInfo() {
  return { type: types.TOGGLE_PICT_INFO }
}
