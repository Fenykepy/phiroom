import { createStructuredSelector } from 'reselect'

const portfolioEditedSelector = state => state.portfolio.edited

export const portfolioEditionSelector = createStructuredSelector({
  edited: portfolioEditedSelector
})
