import { DISPLAY_PORTFOLIO, PORTFOLIO_NEXT_PICT, PORTFOLIO_PREV_PICT, PORTFOLIO_TOGGLE_SLIDESHOW } from '../constants/actionsTypes.js'

import { SHOW, HIDE } from '../constants/showHideStatus.js'
import { ON, OFF } from '../constants/onOffStatus.js'

const DEFAULT_CAROUSEL_HEIGHT = 600

const initialState = {
  headers: [
    {slug: 'portraits', title: 'Portraits'},
    {slug: 'macro', title: 'Un monde miniature'},
    {slug: 'paysages', title: 'Quelque part en france'},
  ],
  portfolios: {
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
      pictures: [2, 4, 6]
    },
    paysages: {
      slug: 'paysages',
      title: 'Quelque part en france',
      order: 3,
      description: '',
      pictures: [3, 5]
    }
  },
  current: 'portraits',
  carousel: {
    current_pict: 0,
    slideshow: true,
  },
  lightbox: {
    visible: false,
    current_pict: 0,
    slideshow: false,
    pict_info: false,
  }
}


export default function portfolio(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_PORTFOLIO:
      return Object.assign({}, state, {
        current_portfolio: action.portfolio
      })
    case PORTFOLIO_NEXT_PICT:
      let next_index = state.carousel.current_pict + 1;
      if (next_index == state.portfolios[state.current].pictures.length) {
        next_index = 0
      }
      return Object.assign({}, state, {
        carousel:  Object.assign({}, state.carousel, {
          current_pict: next_index
        })
      })
    case PORTFOLIO_PREV_PICT:
      let prev_index = state.carousel.current_pict - 1
      if (prev_index < 0) {
        prev_index = state.portfolios[state.current].pictures.length -1;
      }
      return Object.assign({}, state, {
        carousel: Object.assign({}, state.carousel, {
          current_pict: prev_index
        })
      })
    case PORTFOLIO_TOGGLE_SLIDESHOW:
      let slideshow = state.carousel.slideshow
      return Object.assign({}, state, {
        carousel: Object.assign({}, state.carousel, {
          slideshow: ! slideshow
        })
      })
    default:
      return state
  }
}



