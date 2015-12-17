import { SET_MODULE } from '../constants/actionsTypes'
const initialState = {
  current: 'portfolios',
  list: [
    {name: 'portfolios', url: '/portfolio/', title: 'Portfolios'},
    {name: 'weblog', url: '/weblog/', title: 'Weblog'},
    {name: 'contact', url: '/contact/', title: 'Contact'},
  ]
}


export default function modules(state = initialState, action) {
  switch(action.type) {
    case SET_MODULE:
      return Object.assign({}, state, {
        current: action.module
      })
    default:
      return state
  }
}
