import { combineReducers } from 'redux'

import common from './common'
import portfolio from './portfolios'
import weblog from './weblog'
import contact from './contact'
import librairy from './librairy'


const rootReducer = combineReducers({
  common,
  portfolio,
  weblog,
  contact,
  librairy,
})

export default rootReducer
