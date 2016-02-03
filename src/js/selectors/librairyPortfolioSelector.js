import { createSelector, createStructuredSelector } from 'reselect'

import { selectedListSelector } from './librairyListSelector'

export const librairyPortfolioSelector = createStructuredSelector({
  selectedList: selectedListSelector,
})
