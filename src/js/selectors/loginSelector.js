import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { csrfTokenSelector } from './csrfSelectors'


export const loginSelector = createStructuredSelector({
  user: userSelector,
  csrf: csrfTokenSelector,
})
