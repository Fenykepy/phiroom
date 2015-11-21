
const initialState = {
  current: 'portfolios',
  list: [
    {name: 'portfolios', url: '/portfolio', title: 'Portfolios'},
    {name: 'contact', url: '/contact', title: 'Contact'},
  ]
}


export default function modules(state = initialState, action) {
  return state
}
