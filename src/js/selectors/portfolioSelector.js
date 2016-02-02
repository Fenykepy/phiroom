import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

const portfolioHeadersSelector = state => state.portfolio.headers.data

const defaultPortfolioSelector = createSelector(
    portfolioHeadersSelector,
    (headers) => {
      if (headers[0]) return headers[0].slug
    }
)

export const portfolioSelector = createStructuredSelector({
  defaultPortfolio: defaultPortfolioSelector,
})
