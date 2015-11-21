import { combineReducers } from 'redux'

import settings from './settings'
import modules from './modules'
import pictures from './pictures'
import portfolio from './portfolios'
import viewport from './viewport'

const rootReducer = combineReducers({
  settings,
  modules,
  pictures,
  viewport,
  portfolio,
})

export default rootReducer
