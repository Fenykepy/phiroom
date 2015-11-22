import * as types from '../constants/actionsTypes';

// action creators

export function requestPortfolio(portfolio) {
  return {
    type: types.REQUEST_PORTFOLIO,
    portfolio
  }
}

export function receivePortfolio(portfolio, json) {
  return {
    type: types.REQUEST_PORTFOLIO_SUCCESS,
    portfolio,
    portfolio: json.data,
    receivedAt: Date.now()
  }
}

export function requestPortfolioFailure(portfolio, error) {
  return {
    type: types.REQUEST_PORTFOLIO_FAILURE,
    portfolio,
    error
  }
}

export function selectPortfolio(portfolio) {
  return {type: types.SELECT_PORTFOLIO, portfolio}
}

export function nextPict(length) {
  return { type: types.PORTFOLIO_NEXT_PICT, length }
}

export function prevPict(length) {
  return { type: types.PORTFOLIO_PREV_PICT, length }
}

export function toggleSlideshow() {
  return { type: types.PORTFOLIO_TOGGLE_SLIDESHOW }
}

export function toggleLightbox() {
  return { type: types.TOGGLE_LIGHTBOX }
}

export function togglePictInfo() {
  return { type: types.TOGGLE_PICT_INFO }
}
