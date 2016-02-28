import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { settingsSelector } from './settingsSelector'

const descriptionSelector = state => state.contact.description

export const contactDescriptionSelector = createStructuredSelector({
  description: descriptionSelector,
  user: userSelector,
  settings: settingsSelector,
})
