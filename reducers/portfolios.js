import { NEXT_PICT, PREV_PICT, TOGGLE_SLIDESHOW, TOGGLE_LIGHTBOX, TOGGLE_PICT_INFO } from '../constants/actionsTypes.js';

import { SHOW, HIDE } from '../constants/showHideStatus.js';
import { ON, OFF } from '../constants/onOffStatus.js';


const initialState = {
  pictures_light: {},
  portfolios_list: ['portraits'],
  portfolios: {
    portraits: {
      slug: 'portraits',
      title: 'Portraits',
      description: '',
      pictures: []
    }
  },
  current_portfolio: 'portraits',
  current_pict: 0,
  slideshow: ON,
  lightbox: HIDE,
  pict_info: HIDE
}


export default function portfolios(state = initialState, action) {
  switch (action.type) {
    case NEXT_PICT:
      let next_index = state.current_pict + 1;
      if (next_index == state.portfolios[state.current_portfolio].pictures.length) {
        next_index = 0;
      }
      return Object.assign({}, state, {
        current_pict: next_index
      });
    case PREV_PICT:
      let prev_index = state.current_pict - 1;
      if (prev_index < 0) {
        prev_index = state.portfolios[state.current_portfolio].pictures.length -1;
      }
      return Object.assign({}, state, {
        current_pict: prev_index
      });
    default:
      return state;
}



