import { createSelector, createStructuredSelector } from 'reselect'

import { portfolioHeadersSelector } from './portfolioSelector'

/*
 * input selectors
 */

const postsHeadersSelector = state => state.weblog.headers.data

export const librairyLeftPanelSelector = createStructuredSelector({
  portfolioHeaders: portfolioHeadersSelector,
  postsHeaders: postsHeadersSelector,
})
