import { createStructuredSelector } from 'reselect'

import { modulesSelector } from './modulesSelectors'
import { settingsSelector } from './settingsSelectors'
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


