
import { createStructuredSelector } from 'reselect'

import { portfolioSelector } from './portfolioSelectors'
import { weblogSelector } from './weblogSelectors'
import { settingsSelector } from './settingsSelectors'
import { modulesSelector } from './modulesSelectors'
import { viewportSelector } from './viewportSelectors'
import { contactSelector } from './contactSelectors'
import { commonSelector } from './commonSelectors'


export const mainSelector = createStructuredSelector({
  portfolio: portfolioSelector,
  weblog: weblogSelector,
  settings: settingsSelector,
  modules: modulesSelector,
  viewport: viewportSelector,
  contact: contactSelector,
  common: commonSelector,
})
