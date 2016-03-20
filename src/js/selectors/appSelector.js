import { createStructuredSelector } from 'reselect'

import { modulesSelector } from './modulesSelector'
import { modalSelector } from './modalSelector'

/*
 * input selectors
 */

export const appSelector = createStructuredSelector({
  modules: modulesSelector,
  modal: modalSelector,
})


