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

// returns a list of a portfolio's pictures' short data, only fetched ones
export const portfolioPicturesSelector = createSelector(
  selectedPortfolioSelector,
  picturesShortSelector,
  (selectedPortfolio, picturesShort) => {
    if (selectedPortfolio && selectedPortfolio.pictures) {
      let picts = []
      selectedPortfolio.pictures.forEach((pict) => {
        if (picturesShort[pict] && picturesShort[pict].fetched) {
          picts.push(picturesShort[pict])
        }
      })
      return picts
    }
    else { return [] }
  }
)



const dynamicCarouselSelector = state => state.common.viewport.clientSide

const carouselWidthSelector = state => state.common.viewport.width

const viewportHeightSelector = state => state.common.viewport.height

const maxCarouselHeightSelector = state => state.common.settings.carousel_default_height

const slideshowDurationSelector = state => state.common.settings.slideshow_duration

const slideshowStatusSelector = state => state.portfolio.carousel.slideshow


const carouselCurrentPictureSelector = state => state.portfolio.carousel.current_pict


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

const carouselNextsSelector = createSelector(
  carouselCurrentPictureSelector,
  portfolioPicturesSelector,
  (current, pictures) => {
    let nexts = []
    let max_index = pictures.length -1
    let n_nexts = Math.ceil(max_index / 2)
    let index = current + 1
    for (let i=0; i < n_nexts; i++) {
      index = index > max_index ? 0 : index
      nexts.push(index)
      index ++
    }
    return nexts
  }
)


const carouselPrevsSelector = createSelector(
  carouselCurrentPictureSelector,
  portfolioPicturesSelector,
  (current, pictures) => {
    let prevs = []
    let max_index = pictures.length - 1
    let n_prevs = Math.floor(max_index / 2)
    let index = current -1
    for (let i=0; i<n_prevs; i++) {
      index = index < 0 ? max_index : index
      prevs.unshift(index)
      index --
    }
    return prevs
  }
)




let carousel
if (dynamicCarouselSelector) { //client side
  carousel = {
    dynamic: dynamicCarouselSelector,
    current_picture: carouselCurrentPictureSelector,
    slideshow: slideshowStatusSelector,
    slideshowDuration: slideshowDurationSelector,
    height: carouselHeightSelector,
    width: carouselWidthSelector,
    nexts: carouselNextsSelector,
    prevs: carouselPrevsSelector,
  }
} else {
  carousel = {}
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



