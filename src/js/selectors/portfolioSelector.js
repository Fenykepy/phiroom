import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

export const portfolioHeadersSelector = state => state.portfolio.headers.data

export const portfolioHitsSelector = state => state.portfolio.hits

const defaultPortfolioSelector = createSelector(
    portfolioHeadersSelector,
    (headers) => {
      if (headers[0]) return headers[0].slug
    }
)

export const portfolioSelector = createStructuredSelector({
  defaultPortfolio: defaultPortfolioSelector,
})
