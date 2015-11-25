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


// thunks
export function fetchPortfolio(portfolio) {
  return function(dispatch) {
    // start request
    dispatch(requestPortfolio(portfolio))
    // return a promise
    return fetch(`${base_url}api/portfolio/portfolios/${portfolio}/`)
      .then(response =>
          response.json()
      )
      .then(json =>{
          console.log('promise resolved')
          console.log('portfolio', portfolio)
          console.log('json', json)
          dispatch(receivePortfolio(portfolio, json))}
      )
      .catch(error => {
          console.log('error', error)
          console.log('promise rejected')
          dispatch(requestPortfolioFailure(portfolio, error.message))
        }
      )
  }
}
