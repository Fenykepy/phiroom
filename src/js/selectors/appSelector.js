import { createStructuredSelector } from 'reselect'

import { modulesSelector } from './modulesSelector'
import { settingsSelector } from './settingsSelector'
import { userSelector } from './userSelector'
import { modalSelector } from './modalSelector'

/*
 * input selectors
 */

export const appSelector = createStructuredSelector({
  modules: modulesSelector,
  settings: settingsSelector,
  user: userSelector,
  modal: modalSelector,
})


