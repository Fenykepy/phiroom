import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

const portfoliosHeadersSelector = state => state.portfolio.headers.data

const modulesListSelector = state => state.common.modules.list

const currentModuleSelector = state => state.common.modules.current

const mainMenuSelector = createSelector(
  portfoliosHeadersSelector,
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
})
