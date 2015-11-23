import { combineReducers } from 'redux'

import {
  REQUEST_PORTFOLIO,
  REQUEST_PORTFOLIO_SUCCESS,
  REQUEST_PORTFOLIO_FAILURE,
  INVALIDATE_PORTFOLIO,
  SELECT_PORTFOLIO,
  PORTFOLIO_NEXT_PICT,
  PORTFOLIO_PREV_PICT,
  PORTFOLIO_TOGGLE_SLIDESHOW
} from '../constants/actionsTypes.js'


function selected(state = null, action) {
  switch (action.type) {
    case SELECT_PORTFOLIO:
      return action.portfolio
    default:
      return state
  }
}

const headersInitialState = [
    {
      slug: 'portraits',
      title: 'Portraits',
    },
    {
      slug: 'macro',
      title: 'Un monde miniature',
    },
    {
      slug: 'paysages',
      title: 'Quelque part en france',
    },
]


function headers(state = headersInitialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const portfoliosInitialState = {
  portraits: {
    slug: 'portraits',
    title: 'Portraits',
    order: 0,
    description: '',
    pictures: [ 2, 3, 4, 5, 6]
  },
  macro: {
    slug: 'macro',
    title: 'Un monde miniature',
    order: 1,
    description: '',
    pictures: [7, 8, 9]
  },
  paysages: {
    slug: 'paysages',
    title: 'Quelque part en france',
    order: 3,
    description: '',
    pictures: [10, 11, 12]
  }
}


function portfolios(
    //state = portfoliosInitialState,
    state = {},
    action) {
  switch (action.type) {
    case INVALIDATE_PORTFOLIO:
      return Object.assign({}, state, {
        [action.portfolio]: Object.assign({}, state[action.portfolio], {
          did_invalidate: true
        })
      })
    case REQUEST_PORTFOLIO:
      return Object.assign({}, state, {
        [action.portfolio]: Object.assign({}, state[action.portfolio], {
          is_fetching: true,
          fetched: false
        })
      })
    case REQUEST_PORTFOLIO_SUCCESS:
      console.log('action',action)
      return Object.assign({}, state, {
        [action.portfolio]: Object.assign({}, state[action.portfolio], {
          is_fetching: false,
          fetched: true,
          receivedAt: action.receivedAt
        },
        action.data)
      })
    case REQUEST_PORTFOLIO_FAILURE:
      console.log(action)
      return Object.assign({}, state, {
        [action.portfolio]: Object.assign({}, state[action.portfolio], {
          is_fetching: false,
          fetched: false,
          error: action.error
        })
      })
    default:
      return state
  }
}


const carouselInitialState = {
  current_pict: 0,
  slideshow: true,
}

function carousel(state = carouselInitialState, action) {
  switch (action.type) {
    case SELECT_PORTFOLIO:
      // reset current picture
      return Object.assign({}, state, {
        current_pict: 0
      })
    case PORTFOLIO_NEXT_PICT:
      let next_index = state.current_pict + 1
      next_index = next_index == action.length ? 0 : next_index
      return Object.assign({}, state, {
        current_pict: next_index
      })
    case PORTFOLIO_PREV_PICT:
      let prev_index = state.current_pict - 1
      prev_index = prev_index < 0 ? action.length - 1 : prev_index
      return Object.assign({}, state, {
        current_pict: prev_index
      })
    case PORTFOLIO_TOGGLE_SLIDESHOW:
      return Object.assign({}, state, {
        slideshow: ! state.slideshow
      })
    default:
      return state
  }
}

const lightboxInitialState = {
  visible: false,
  current_pict: 0,
  slideshow: false,
  pict_info: false,
}


function lightbox(state = lightboxInitialState, action) {
  switch (action.type) {
    default:
      return state
  }
}

const portfolio = combineReducers({
  selected,
  headers,
  portfolios,
  carousel,
  lightbox
})

export default portfolio
