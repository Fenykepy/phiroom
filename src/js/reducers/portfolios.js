import { DISPLAY_PORTFOLIO, NEXT_PICT, PREV_PICT, TOGGLE_SLIDESHOW, TOGGLE_LIGHTBOX, TOGGLE_PICT_INFO } from '../constants/actionsTypes.js'

import { SHOW, HIDE } from '../constants/showHideStatus.js'
import { ON, OFF } from '../constants/onOffStatus.js'



const initialState = {
  portfolios_list: [
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
  current_portfolio: 'portraits',
  carousel: {
    prevs_pict: [],
    current_pict: 0,
    next_pict: [],
    pict_height: 600,
    slideshow: ON,
    swaping: null,
  },
  lightbox: HIDE,
  pict_info: HIDE
}


export default function portfolios(state = initialState, action) {
  switch (action.type) {
    case DISPLAY_PORTFOLIO:
      return Object.assign({}, state, {
        current_portfolio: action.portfolio
      })
    case NEXT_PICT:
      let next_index = state.current_pict + 1;
      if (next_index == state.portfolios[state.current_portfolio].pictures.length) {
        next_index = 0
      }
      return Object.assign({}, state, {
        current_pict: next_index
      })
    case PREV_PICT:
      let prev_index = state.current_pict - 1
      if (prev_index < 0) {
        prev_index = state.portfolios[state.current_portfolio].pictures.length -1;
      }
      return Object.assign({}, state, {
        current_pict: prev_index
      })
    default:
      return state
  }
}



