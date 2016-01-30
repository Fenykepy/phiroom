import { fetchPortfoliosHeadersIfNeeded } from '../actions/portfolios'
import { fetchCSRFTokenIfNeeded } from '../actions/common'

export const fetchCommonData = function(store) {
  let promises = []
  // fetch current user data
  // fetch settings
  // fetch portfolios headers if necessary
  promises.push(
      store.dispatch(fetchPortfoliosHeadersIfNeeded()),
      store.dispatch(fetchCSRFTokenIfNeeded())
  )
  // return a list of promises to wait for server side
  return promises
}

