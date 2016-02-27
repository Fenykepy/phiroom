import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'

const descriptionSelector = state => state.contact.description

export const contactDescriptionSelector = createStructuredSelector({
  description: descriptionSelector,
  user: userSelector,
})
