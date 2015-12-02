import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionsTypes';

import { base_url } from '../config'

// action creators


export function requestPortfoliosHeaders() {
  return {
    type: types.REQUEST_PORTFOLIOS_HEADERS
  }
}

export function receivePortfoliosHeaders(json) {
  return {
    type: types.REQUEST_PORTFOLIOS_HEADERS_SUCCESS,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPortfoliosHeadersFailure(error) {
  return {
    type: types.REQUEST_PORTFOLIOS_HEADERS_FAILURE,
    error
  }
}

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
  if (item.is_fetching || item.fetched) { return false }
  return true
}

function shouldFetchPortfoliosHeaders(state) {
  // returns true if headers haven't been fetched or are invalidate
  const headers = state.portfolio.headers
  if (! headers) { return true }
  if (headers.is_fetching || headers.fetched) { return false }
  return true
}

export function fetchPortfolioIfNeeded(portfolio) {
  // fetch portfolio if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPortfolio(getState(), portfolio)) {
      return dispatch(fetchPortfolio(portfolio))
    }
  }
}

export function fetchPortfoliosHeadersIfNeeded() {
  // fetch portfolios headers if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPortfoliosHeaders(getState())) {
      return dispatch(fetchPortfoliosHeaders())
    }
  }
}

export function fetchPortfolio(portfolio) {
  /*
   * fetch a portfolio's data
   */
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

export function fetchPortfoliosHeaders() {
  // fetch all portfolios headers
  return function(dispatch) {
    // start request
    dispatch(requestPortfoliosHeaders())
    // return a promise
    return fetch(`${base_url}api/portfolio/headers/`)
      .then(response =>
          response.json()
      )
      .then(json => {
          dispatch(receivePortfoliosHeaders(json))
          // got to default portfolio
          dispatch(goToPortfolio(json[0].slug))
        }
      )
      .catch(error =>
          dispatch(requestPortfoliosHeadersFailure(error.message))
      )
  }
}
