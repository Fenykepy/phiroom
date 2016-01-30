import { createStructuredSelector } from 'reselect'

const messageSelector = state => state.contact.message

export const contactMessageSelector = createStructuredSelector({
  message: messageSelector
})
