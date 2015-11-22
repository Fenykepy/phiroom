import { createSelector, createStructuredSelector } from 'reselect'


import { carouselSelector } from './carouselSelectors'


/*
 * input selectors
 */

const selectedPortfolioSelector = state => state.portfolio.portfolios[
    state.portfolio.headers[state.portfolio.selected].slug
]

const picturesShortSelector = state => state.pictures.short

/*
 * combined selectors
 */
// returns a list of a portfolio's pictures' short data
const portfolioPicturesSelector = createSelector(
  selectedPortfolioSelector,
  picturesShortSelector,
  (selectedPortfolio, picturesShort) => {
    return selectedPortfolio.pictures.map((pict) => picturesShort[pict])
  }
)

export const portfolioSelector = createStructuredSelector({
  selected: selectedPortfolioSelector,
  pictures: portfolioPicturesSelector,
  carousel: carouselSelector,
})

