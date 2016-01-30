import { createStructuredSelector } from 'reselect'

const descriptionSelector = state => state.contact.description

export const contactDescriptionSelector = createStructuredSelector({
  description: descriptionSelector
})
