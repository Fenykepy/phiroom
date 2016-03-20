import { createSelector, createStructuredSelector } from 'reselect'

import { portfolioHeadersSelector } from './portfolioSelector'

/*
 * input selectors
 */

const librairyContainerSelector = state => state.librairy.container

const modulesListSelector = state => state.common.modules.list

const currentModuleSelector = state => state.common.modules.current

const mainMenuSelector = createSelector(
  portfolioHeadersSelector,
  modulesListSelector,
  (portfolios, list) => {
    return list.map((item) => {
      switch (item.name) {
        case "portfolios":
          item.subMenu = portfolios
          item.onclick = () => {return} // dispatch here changement of current portfolio
          return item
        default:
          item.subMenu = []
          return item
      }
    })
  }
)

export const modulesSelector = createStructuredSelector({
  current: currentModuleSelector,
  mainMenu: mainMenuSelector,
  librairyLink: librairyContainerSelector,
})
