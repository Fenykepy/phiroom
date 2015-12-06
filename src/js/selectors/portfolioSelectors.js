import { createSelector, createStructuredSelector } from 'reselect'


import { carouselSelector } from './carouselSelectors'


/*
 * input selectors
 */

const selectedPortfolioSelector = state => state.portfolio.portfolios[
  state.portfolio.selected]

const picturesShortSelector = state => state.pictures.short

/*
 * combined selectors
 */
// returns a list of a portfolio's pictures' short data
const portfolioPicturesSelector = createSelector(
  selectedPortfolioSelector,
  picturesShortSelector,
  (selectedPortfolio, picturesShort) => {
    if (selectedPortfolio && selectedPortfolio.pictures) {
      return selectedPortfolio.pictures.map((pict) => {
        if (picturesShort[pict]) return picturesShort[pict]
      })
    }
    else { return [] }
  }
)

export const portfolioSelector = createStructuredSelector({
  selected: selectedPortfolioSelector,
  pictures: portfolioPicturesSelector,
  carousel: carouselSelector,
})

