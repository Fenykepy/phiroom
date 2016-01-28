import * as types from '../constants/actionsTypes'

import Fetch from '../helpers/http'

import { receiveShortPicture } from './pictures'


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




export function requestPortfolioPictures(portfolio) {
  return {
    type: types.REQUEST_PORTFOLIO_PICTURES,
    portfolio
  }
}

export function receivePortfolioPictures(portfolio, json) {
  return {
    type: types.REQUEST_PORTFOLIO_PICTURES_SUCCESS,
    portfolio,
    data: json,
    receivedAt: Date.now()
  }
}

export function requestPortfolioPicturesFailure(portfolio, error) {
  return {
    type: types.REQUEST_PORTFOLIO_PICTURES_FAILURE,
    portfolio,
    error
  }
}

export function orderPortfolioPictures(portfolio, new_order) {
  return {
    type: types.ORDER_PORTFOLIO_PICTURES,
    portfolio,
    new_order
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
  if (! item || item.did_invalidate) { return true }
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
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve(
          {data: getState().portfolio.portfolios[portfolio]}
    ))
  }
}

export function fetchPortfoliosHeadersIfNeeded() {
  // fetch portfolios headers if it's not done yet
  return (dispatch, getState) => {
    if (shouldFetchPortfoliosHeaders(getState())) {
      return dispatch(fetchPortfoliosHeaders())
    }
    // else return a resolved promise
    return new Promise((resolve, reject) => resolve())
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
    return Fetch.get(`api/portfolio/portfolios/${portfolio}/`)
      .then(json =>
          dispatch(receivePortfolio(portfolio, json))
      )
      .catch(error => 
          dispatch(requestPortfolioFailure(portfolio, error.message))
      )
  }
}


export function fetchPortfolioPictures(portfolio) {
  /*
   * fetch all pictures of a portfolio at once
   */
  return function(dispatch) {
    // start request
    dispatch(requestPortfolioPictures(portfolio))
    // return a promise
    return Fetch.get(`api/portfolio/portfolios/${portfolio}/pictures/`)
      .then(json => {
        json.map((item) => {
            dispatch(receiveShortPicture(item.pk, item))
        })
      })
      /*.catch(error => {
          console.log(error.message)
          dispatch(requestPortfolioPicturesFailure(
              portfolio, error.message))
      })*/
  }
}


export function fetchPortfoliosHeaders() {
  // fetch all portfolios headers
  return function(dispatch) {
    // start request
    dispatch(requestPortfoliosHeaders())
    // return a promise
    return Fetch.get('api/portfolio/headers/')
      .then(json => 
          dispatch(receivePortfoliosHeaders(json))
      )
      .catch(error =>
          dispatch(requestPortfoliosHeadersFailure(error.message))
      )
  }
}



/*
 * Portfolio edition
 */

function editPortfolio(data = {}) {
  // start portfolio edition with given datas
  return {
    type: types.PORTFOLIO_EDIT_PREFILL,
    data: data
  }
}

export function newPortfolio() {
  // start a new portfolio edition with empty datas
  return function(dispatch) {
    return dispatch(editPortfolio())
  }
}

export function updatePortfolio(portfolio) {
  return function(dispatch, getState) {
    return dispatch(fetchPortfolioIfNeeded(portfolio))
      .then(() => {
        portfolio_data = getState().portfolio.portfolios[portfolio]
        return dispatch(editPortfolio({
            slug: portfolio_data.slug,
            title: portfolio_data.title,
            draft: portfolio_data.draft,
            pub_date: portfolio_data.pub_date,
            order: portfolio_data.order,
        }))
      })
  }
}

export function portfolioSetTitle(title) {
  return {
    type: types.PORTFOLIO_EDIT_SET_TITLE,
    title
  }
}

export function portfolioSetDraft(draft) {
  return {
    type: types.PORTFOLIO_EDIT_SET_DRAFT,
    draft
  }
}

export function portfolioSetPubdate(pubdate) {
  return {
    type: types.PORTFOLIO_EDIT_SET_PUBDATE,
    pubdate
  }
}

export function portfolioSetOrder(order) {
  return {
    type: types.PORTFOLIO_EDIT_SET_ORDER,
    order
  }
}

function requestCreatePortfolio() {
  return {
    type: types.REQUEST_CREATE_PORTFOLIO,
  }
}

function receiveNewPortfolio(json) {
  return {
    type: types.REQUEST_CREATE_PORTFOLIO_SUCCESS,
    portfolio: json.slug,
    data: json,
    receivedAt: Date.now()
  }
}

function requestCreatePortfolioFailure(errors) {
  return {
    type: types.REQUEST_CREATE_PORTFOLIO_FAILURE,
    errors
  }
}

export function createPortfolio() {
  return function(dispatch, getState) {
    dispatch(requestCreatePortfolio())
    let port = getState().portfolio.edited
    let data = {
      title: port.title,
      draft: port.draft,
      pub_date: port.pubdate,
      order: port.order,
    }

    return Fetch.post('api/portfolio/portfolios/',
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch new portfolios headers
      dispatch(fetchPortfoliosHeaders())
      return dispatch(receiveNewPortfolio(json))
    })
    .catch(error => {
      console.log(error.message)
      return dispatch(requestCreatePortfolioFailure(error.message))
    })
  }
}

export function updatePortfolio() {

}
