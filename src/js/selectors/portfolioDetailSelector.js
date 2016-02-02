import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

// all pictures public's datas
const picturesShortSelector = state => state.pictures.short

// selected portfolio object
const selectedPortfolioSelector = state => state.portfolio.portfolios[
  state.portfolio.selected
]

// number of pictures in portfolio (fetched or not)
const portfolioPicturesNumberSelector = createSelector(
    selectedPortfolioSelector,
    (selectedPortfolio) => {
      if (selectedPortfolio && selectedPortfolio.pictures) {
        return selectedPortfolio.pictures.length
      }
      return 0
  }
)

// post list of picture's pks
const portfolioPicturesListSelector = createSelector(
    selectedPortfolioSelector,
    (selectedPortfolio) => {
      if (selectedPortfolio && selectedPortfolio.pictures) {
        return selectedPortfolio.pictures
      }
      return []
  }
)






