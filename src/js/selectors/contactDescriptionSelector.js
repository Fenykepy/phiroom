import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { settingsSelector } from './settingsSelector'

const descriptionSelector = state => state.contact.description
const hitsSelector = state => state.contact.hits

export const contactDescriptionSelector = createStructuredSelector({
  description: descriptionSelector,
  user: userSelector,
  hits: hitsSelector,
  settings: settingsSelector,
})
