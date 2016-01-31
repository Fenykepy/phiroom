
import { createStructuredSelector } from 'reselect'

import { portfolioSelector } from './portfolioSelectors'
import { weblogSelector } from './weblogSelectors'
import { settingsSelector } from './settingsSelectors'
import { modulesSelector } from './modulesSelectors'
import { viewportSelector } from './viewportSelectors'
import { commonSelector } from './commonSelectors'
import { lightboxSelector } from './lightboxSelectors'
import { librairySelector } from './librairySelectors'
import { userSelector } from './userSelectors'
import { modalSelector } from './modalSelector'


export const mainSelector = createStructuredSelector({
  /* to remove */
  portfolio: portfolioSelector,
  /* to remove */
  weblog: weblogSelector,
  settings: settingsSelector,
  modules: modulesSelector,
  viewport: viewportSelector,
  common: commonSelector,
  lightbox: lightboxSelector,
  /* to remove */
  librairy: librairySelector,
  user: userSelector,
  modal: modalSelector,
})

