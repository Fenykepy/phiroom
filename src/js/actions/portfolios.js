import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionsTypes';

import { base_url } from '../config'

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
    data: json,
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

export function invalidatePortfolio(portfolio) {
  return {
    type: types.INVALIDATE_PORTFOLIO,
    portfolio,
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

function shouldFetchPortfolio(state, portfolio) {
  const item = state.portfolio.portfolios[portfolio]
  if (! item) { return true }
  if (item.is_fetching) { return false } 
  return true
}

// thunks
function fetchPortfolio(portfolio) {
  return function(dispatch) {
    // start request
    dispatch(requestPortfolio(portfolio))
    // return a promise
    return fetch(`${base_url}api/portfolio/portfolios/${portfolio}/`)
      .then(response =>
          response.json()
      )
      .then(json =>
          dispatch(receivePortfolio(portfolio, json))
      )
      .catch(error => 
          dispatch(requestPortfolioFailure(portfolio, error.message))
      )
  }
}
