import * as types from '../constants/actionsTypes'

import { browserHistory } from 'react-router'

import Fetch from '../helpers/http'

import { setTitle } from './librairy'
import { setDocumentTitleIfNeeded } from './title'
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
  return function(dispatch, getState) {
    // start request
    dispatch(requestPortfolio(portfolio))
    // return a promise
    return Fetch.get(`api/portfolio/portfolios/${portfolio}/`, getState())
      .then(json =>
          dispatch(receivePortfolio(portfolio, json))
      )
      .catch(error => 
          dispatch(requestPortfolioFailure(portfolio, error))
      )
  }
}


export function fetchPortfolioPictures(portfolio) {
  /*
   * fetch all pictures of a portfolio at once
   */
  return function(dispatch, getState) {
    // start request
    dispatch(requestPortfolioPictures(portfolio))
    // return a promise
    return Fetch.get(`api/portfolio/portfolios/${portfolio}/pictures/`, getState())
      .then(json => {
        json.map((item) => {
            dispatch(receiveShortPicture(item.sha1, item))
        })
      })
  }
}


export function fetchPortfoliosHeaders() {
  // fetch all portfolios headers
  return function(dispatch, getState) {
    // start request
    dispatch(requestPortfoliosHeaders())
    // return a promise
    return Fetch.get('api/portfolio/headers/', getState())
      .then(json => {
          dispatch(receivePortfoliosHeaders(json))
          // fetch hits counts
          let staff = getState().common.user.is_staff || null
          console.log(getState().common.user)
          if (staff) {
            json.map(port => {
              dispatch(fetchHits(port.slug))
            })
          }
      })
      .catch(error =>
          dispatch(requestPortfoliosHeadersFailure(error))
      )
  }
}

/*
 * Portfolios hits
 */

function receiveHits(portfolio, json) {
  return {
    type: types.REQUEST_PORTFOLIO_HITS,
    portfolio,
    hits: json,
  }
}


export function fetchHits(portfolio) {
  /*
   * fetch a portfolio hits number
   */
  return function(dispatch, getState) {
    return Fetch.get(`api/portfolio/portfolios/${portfolio}/hits/`, getState())
      .then(json =>
          dispatch(receiveHits(portfolio, json))
      )
      .catch(error => {
        throw error
      })
  }
}


/*
 * Portfolio edition
 */

function prefillPortfolioForm(data = {}) {
  // start portfolio edition with given datas
  return {
    type: types.PORTFOLIO_EDIT_PREFILL,
    data: data
  }
}

export function newPortfolio() {
  // start a new portfolio edition with empty datas
  return function(dispatch) {
    return dispatch(prefillPortfolioForm())
  }
}

export function editPortfolio(portfolio) {
  return function(dispatch, getState) {
    return dispatch(fetchPortfolioIfNeeded(portfolio))
      .then(data => {
        return dispatch(prefillPortfolioForm({
            slug: data.data.slug,
            title: data.data.title,
            draft: data.data.draft,
            pub_date: data.data.pub_date,
            order: data.data.order,
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

function getEditedData(state) {
    let port = state.portfolio.edited
    return  {
      title: port.title,
      draft: port.draft,
      pub_date: port.pubdate,
      order: port.order,
    }
}

export function createPortfolio() {
  return function(dispatch, getState) {
    dispatch(requestCreatePortfolio())
    let data = getEditedData(getState())

    return Fetch.post('api/portfolio/portfolios/',
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      dispatch(receiveNewPortfolio(json))
      // navigate to new portfolio
      browserHistory.push(`/librairy/portfolio/${json.title}/`)
      // refetch new portfolios headers
      return dispatch(fetchPortfoliosHeaders())
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestCreatePortfolioFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}

function requestUpdatePortfolio() {
  return {
    type: types.REQUEST_UPDATE_PORTFOLIO,
  }
}

function receiveUpdatedPortfolio(portfolio, json) {
  return {
    type: types.REQUEST_UPDATE_PORTFOLIO_SUCCESS,
    slug: json.slug,
    old_slug: portfolio,
    data: json,
    receivedAt: Date.now()
  }
}

function requestUpdatePortfolioFailure(errors) {
  return {
    type: types.REQUEST_UPDATE_PORTFOLIO_FAILURE,
    errors
  }
}


export function updatePortfolio(portfolio) {
  return function(dispatch, getState) {
    dispatch(requestUpdatePortfolio())
    let data = getEditedData(getState())

    return Fetch.patch(`api/portfolio/portfolios/${portfolio}/`,
      getState(),
      {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      JSON.stringify(data)
    )
    .then(json => {
      // refetch portfolios headers
      dispatch(fetchPortfoliosHeaders())
      // set librairy title and document title
      dispatch(setTitle(json.title))
      dispatch(setDocumentTitleIfNeeded(json.title))
      return dispatch(receiveUpdatedPortfolio(portfolio, json))
    })
    .catch(error =>
      error.response.json().then(json => {
        // store error json in state
        dispatch(requestUpdatePortfolioFailure(json))
        // throw error to catch it in form and display it
        throw error
      })
    )
  }
}

export function deletePortfolio(portfolio) {
  /*
   * delete a portfolio from server
   */
  return function(dispatch, getState) {
    Fetch.delete(`api/portfolio/portfolios/${portfolio}/`, getState())
      .then(() => {
        // refetch portfolios headers
        dispatch(fetchPortfoliosHeaders())
        // go to librairy root
        browserHistory.push('/librairy/')
      })

    return {
      type: types.PORTFOLIO_DELETE,
      portfolio
    }
  }
}
