import { createSelector, createStructuredSelector } from 'reselect'

import {
  portfolioHeadersSelector,
  portfolioHitsSelector,
} from './portfolioSelector'

import { userSelector } from './userSelector'

/*
 * input selectors
 */

const librairyContainerSelector = state => state.librairy.container

const modulesListSelector = state => state.common.modules.list

const currentModuleSelector = state => state.common.modules.current

const portfolioMenuSelector = createSelector(
  portfolioHeadersSelector,
  portfolioHitsSelector,
  userSelector,
  (headers, hits, user) => {
    return headers.map(port => {
      return {
        slug: port.slug,
        url: port.url,
        title: port.title,
        hits: hits[port.slug] || null,
        staff: user.is_staff,
      }
    })
  }
)

const mainMenuSelector = createSelector(
  portfolioMenuSelector,
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
