
import { createStructuredSelector } from 'reselect'

import { portfolioSelector } from './portfolioSelectors'
import { settingsSelector } from './settingsSelectors'
import { modulesSelector } from './modulesSelectors'
import { viewportSelector } from './viewportSelectors'


export const mainSelector = createStructuredSelector({
  portfolio: portfolioSelector,
  settings: settingsSelector,
  modules: modulesSelector,
  viewport: viewportSelector
})
