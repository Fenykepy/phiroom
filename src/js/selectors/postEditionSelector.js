import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'

const postEditedSelector = state => state.weblog.edited

export const postEditionSelector = createStructuredSelector({
  edited: postEditedSelector,
  user: userSelector,
})
