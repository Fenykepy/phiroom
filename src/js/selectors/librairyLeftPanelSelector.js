import { createSelector, createStructuredSelector } from 'reselect'

import { portfolioHeadersSelector } from './portfolioSelector'

/*
 * input selectors
 */

export const librairyLeftPanelSelector = createStructuredSelector({
  portfolioHeaders: portfolioHeadersSelector,
})
