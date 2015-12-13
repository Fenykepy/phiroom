
import { createStructuredSelector } from 'reselect'

import { portfolioSelector } from './portfolioSelectors'
import { settingsSelector } from './settingsSelectors'
import { modulesSelector } from './modulesSelectors'
import { viewportSelector } from './viewportSelectors'
import { contactSelector } from './contactSelectors'
import { commonSelector } from './commonSelectors'


export const mainSelector = createStructuredSelector({
  portfolio: portfolioSelector,
  settings: settingsSelector,
  modules: modulesSelector,
  viewport: viewportSelector,
  contact: contactSelector,
  common: commonSelector,
})
