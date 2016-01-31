import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { csrfTokenSelector } from './csrfSelectors'

const messageSelector = state => state.contact.message

export const contactMessageSelector = createStructuredSelector({
  message: messageSelector,
  user: userSelector,
  csrf: csrfTokenSelector,
})
