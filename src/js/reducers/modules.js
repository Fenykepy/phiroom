
const initialState = {
  currentModule: 'portfolios',
  mainMenu: [
    {name: 'portfolios', url: '/portfolio', title: 'Portfolios'},
    {name: 'contact', url: '/contact', title: 'Contact'},
  ]
}


export default function modules(state = initialState, action) {
  return state
}