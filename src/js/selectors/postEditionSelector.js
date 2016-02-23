import { createStructuredSelector } from 'reselect'

const postEditedSelector = state => state.post.edited

export const postEditionSelector = createStructuredSelector({
  edited: portfolioEditedSelector
})
