import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */

// pictures public data database
const picturesShortSelector = state => state.pictures.short

// pictures sha1 in a list [sha1, sha1, sha1]
const lightboxPicturesSelector = state => state.lightbox.pictures

// selected picture sha1, must be in PicturesSelector
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
  lightboxCurrentIndexSelector,
  picturesShortSelector,
  (currentIndex, picturesShort) => {
    if (currentIndex == -1) return null
    return picturesShort[currentIndex] || null
  }
)

// previous picture object
const lightboxPreviousPictSelector = createSelector(
  lightboxCurrentIndexSelector,
  lightboxLengthSelector,
  picturesShortSelector,
  (currentIndex, length, picturesShort) => {
    let prev = currentIndex - 1
    prev = prev >= 0 ? prev : length - 1

    return picturesShort[prev] || null
  }
)

// next picture object
const lightboxNextPictSelector = createSelector(
  lightboxCurrentIndexSelector,
  lightboxLengthSelector,
  picturesShortSelector,
  (currentIndex, length, picturesShort) => {
    let next = currentIndex + 1
    next = next < length - 1 ? next : 0
    return picturesShort[next] || null
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
