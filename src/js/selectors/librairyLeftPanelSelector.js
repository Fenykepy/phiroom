import { createSelector, createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { portfolioHeadersSelector } from './portfolioSelector'

/*
 * input selectors
 */

const dragSelector = state => state.librairy.drag

export const librairyLeftPanelSelector = createStructuredSelector({
  portfolioHeaders: portfolioHeadersSelector,
  user: userSelector,
  drag: dragSelector,
})
