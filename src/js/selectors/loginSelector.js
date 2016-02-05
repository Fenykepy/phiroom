import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { csrfTokenSelector } from './csrfSelector'


export const loginSelector = createStructuredSelector({
  user: userSelector,
  csrf: csrfTokenSelector,
})
