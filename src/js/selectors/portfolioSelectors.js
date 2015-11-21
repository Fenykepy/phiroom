import { createSelector, createStructuredSelector } from 'reselect'


import { carouselSelector } from './carouselSelectors'


/*
 * input selectors
 */

const currentPortfolioSelector = state => state.portfolio.portfolios[
    state.portfolio.current
]

const picturesShortSelector = state => state.pictures.short

/*
 * combined selectors
 */
// returns a list of a portfolio's pictures' short data
const portfolioPicturesSelector = createSelector(
  currentPortfolioSelector,
  picturesShortSelector,
  (currentPortfolio, picturesShort) => {
    return currentPortfolio.pictures.map((pict) => picturesShort[pict])
  }
)

export const portfolioSelector = createStructuredSelector({
  current: currentPortfolioSelector,
  pictures: portfolioPicturesSelector,
  carousel: carouselSelector,
})

