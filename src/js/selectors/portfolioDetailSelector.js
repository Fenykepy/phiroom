import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

// all pictures public's datas
const picturesShortSelector = state => state.common.pictures.short

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

// post list of picture's sha1s
const portfolioPicturesListSelector = createSelector(
    selectedPortfolioSelector,
    (selectedPortfolio) => {
      if (selectedPortfolio && selectedPortfolio.pictures) {
        return selectedPortfolio.pictures
      }
      return []
  }
)

// returns a list of a portfolio's pictures' short data, only fetched ones
export const portfolioPicturesSelector = createSelector(
  selectedPortfolioSelector,
  picturesShortSelector,
  (selectedPortfolio, picturesShort) => {
    let picts = []
    if (selectedPortfolio && selectedPortfolio.pictures) {
      selectedPortfolio.pictures.forEach((pict) => {
        if (picturesShort[pict] && picturesShort[pict].fetched) {
          picts.push(picturesShort[pict])
        }
      })
    }
    return picts
  }
)



const dynamicCarouselSelector = state => state.common.viewport.clientSide

const viewportHeightSelector = state => state.common.viewport.height

const maxCarouselHeightSelector = state => state.common.settings.carousel_default_height

const slideshowDurationSelector = state => state.common.settings.slideshow_duration



const carouselHeightSelector = createSelector(
  maxCarouselHeightSelector,
  viewportHeightSelector,
  (max_height, viewport_height) => {
    switch (true) {
      case (viewport_height == null):
        return max_height
      case (viewport_height < max_height):
        return viewport_height - 20
      default:
        return max_height
    }
  }
)


let carousel = {}
if (dynamicCarouselSelector) { //client side
  carousel = {
    dynamic: dynamicCarouselSelector,
    slideshowDuration: slideshowDurationSelector,
    height: carouselHeightSelector,
  }
}

export const carouselSelector = createStructuredSelector(carousel)

export const portfolioDetailSelector = createSelector(
  selectedPortfolioSelector,
  portfolioPicturesNumberSelector,
  portfolioPicturesListSelector,
  portfolioPicturesSelector,
  carouselSelector,
  (selected, n_picts, pictsList, pictures, carousel) => {
    return Object.assign({},
        selected,
        {picturesList: pictsList},
        {n_pictures: n_picts},
        {pictures: pictures},
        {carousel: carousel}
    )
  }
)



