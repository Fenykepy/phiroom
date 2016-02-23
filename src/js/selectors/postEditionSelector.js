import { createStructuredSelector } from 'reselect'

const postEditedSelector = state => state.weblog.edited

export const postEditionSelector = createStructuredSelector({
  edited: portfolioEditedSelector
})
