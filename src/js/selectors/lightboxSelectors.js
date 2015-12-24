import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

// pictures public data database
const picturesShortSelector = state => state.pictures.short

// pictures pk in a list [2, 8, 16]
const lightboxPicturesSelector = state => state.lightbox.pictures

// selected picture pk, must be in PicturesSelector
const lightboxCurrentSelector = state => state.lightbox.current

// boolean if lightbox is visible or not
const lightboxActivatedSelector = state => state.lightbox.activated

// boolean if lightbox slideshow is started or not
const lightboxSlideshowSelector = state => state.lightbox.slideshow

// boolean if lightbox image data (legend) is visible or not
const lightboxShowInfoSelector = state => state.lightbox.showInfo

// number of images in lightbox
const lightboxLengthSelector = state => state.lightbox.pictures.length

// current index of selected picture in pictures list
const lightboxCurrentIndexSelector = createSelector(
  lightboxPicturesSelector,
  lightboxCurrentSelector,
  (pictures, current) => {
    return pictures.indexOf(current)
  }
)

// selected picture object
const lightboxCurrentPictSelector = createSelector(
  lightboxCurrentSelector,
  picturesShortSelector,
  (current, picturesShort) => {
    return picturesShort[current] || null
  }
)

// previous picture index
const lightboxPreviousIndexSelector = createSelector(
  lightboxPicturesSelector,
  lightboxCurrentIndexSelector,
  lightboxLengthSelector,
  (pictures, currentIndex, length) => {
    let prev = currentIndex - 1
    prev = prev >= 0 ? prev : length - 1
    return pictures[prev]
  }
)

// previous picture object
const lightboxPreviousPictSelector = createSelector(
  lightboxPreviousIndexSelector,
  picturesShortSelector,
  (previousIndex, picturesShort) => {
    return picturesShort[previousIndex] || null
  }
)

// next picture index
const lightboxNextIndexSelector = createSelector(
  lightboxPicturesSelector,
  lightboxCurrentIndexSelector,
  lightboxLengthSelector,
  (pictures, currentIndex, length) => {
    let next = currentIndex + 1
    next = next < length - 1 ? next : 0
    return pictures[next]
  }
)

// next picture object
const lightboxNextPictSelector = createSelector(
  lightboxNextIndexSelector,
  picturesShortSelector,
  (nextIndex, picturesShort) => {
    return picturesShort[nextIndex] || null
  }
)

export const lightboxSelector = createStructuredSelector({
  current: lightboxCurrentPictSelector,
  next: lightboxNextPictSelector,
  previous: lightboxPreviousPictSelector,
  pictures: lightboxPicturesSelector,
  length: lightboxLengthSelector,
  activated: lightboxActivatedSelector,
  slideshow: lightboxSlideshowSelector,
  showInfo: lightboxShowInfoSelector,
})
