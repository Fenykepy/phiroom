import { createStructuredSelector } from 'reselect'

import { modulesSelector } from './modulesSelector'
import { settingsSelector } from './settingsSelector'
import { userSelector } from './userSelector'

/*
 * input selectors
 */

export const headersSelector = createStructuredSelector({
  modules: modulesSelector,
  settings: settingsSelector,
  user: userSelector,
})
