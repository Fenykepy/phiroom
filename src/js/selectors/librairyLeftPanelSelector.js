import { createSelector, createStructuredSelector } from 'reselect'

import { portfolioHeadersSelector } from './portfolioSelector'

/*
 * input selectors
 */

export const postsHeadersSelector = state => state.weblog.headers.data
export const collectionsHeadersSelector = state => state.librairy.collection.headers.data

export const librairyLeftPanelSelector = createStructuredSelector({
  portfolioHeaders: portfolioHeadersSelector,
  postsHeaders: postsHeadersSelector,
  collectionsHeaders: collectionsHeadersSelector,
})
