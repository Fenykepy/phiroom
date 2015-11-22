import { createSelector, createStructuredSelector } from 'reselect'

/*
 * input selectors
 */

const dynamicCarouselSelector = state => state.viewport.clientSide

const carouselWidthSelector = state => state.viewport.width

const viewportHeightSelector = state => state.viewport.height

const maxCarouselHeightSelector = state => state.settings.carousel_default_height

const slideshowDurationSelector = state => state.settings.slideshow_duration

const slideshowStatusSelector = state => state.portfolio.carousel.slideshow

const carouselPicturesSelector = state => state.portfolio.portfolios[
  state.portfolio.headers[state.portfolio.selected].slug].pictures


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
  carouselPicturesSelector,
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
  carouselPicturesSelector,
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






