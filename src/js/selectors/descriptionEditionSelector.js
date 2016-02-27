import { createStructuredSelector } from 'reselect'

const descriptionEditedSelector = state => state.contact.edited

export const descriptionEditionSelector = createStructuredSelector({
  edited: descriptionEditedSelector
})
