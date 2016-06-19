import { createSelector, createStructuredSelector } from 'reselect'

import { staffSelector } from './userSelector'

/*
 * input selectors
 */

// client side
const clientSideSelector = state => state.common.viewport.clientSide

// pictures public data database
const picturesShortSelector = state => state.common.pictures.short

// pictures hits
const picturesHitsSelector = state => state.common.pictures.hits

// pictures sha1s in a list [2, 8, 16]
const lightboxPicturesSelector = state => state.common.lightbox.pictures

// selected picture sha1s, must be in PicturesSelector
const lightboxCurrentSelector = state => state.common.lightbox.current

// boolean if lightbox is visible or not
const lightboxActivatedSelector = state => state.common.lightbox.activated

// boolean if lightbox slideshow is started or not
const lightboxSlideshowSelector = state => state.common.lightbox.slideshow

// boolean if lightbox image data (legend) is visible or not
const lightboxShowInfoSelector = state => state.common.lightbox.showInfo

// number of images in lightbox
const lightboxLengthSelector = state => state.common.lightbox.pictures.length


// boolean if current <img /> file is loaded
const lightboxCurrentLoadedSelector = state => state.common.lightbox.currentLoaded

// boolean if next <img /> file is loaded
const lightboxNextLoadedSelector = state => state.common.lightbox.nextLoaded

// boolean if previous <img /> file is loaded
const lightboxPreviousLoadedSelector = state => state.common.lightbox.previousLoaded



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
  picturesHitsSelector,
  (current, picturesShort, hits) => {
    let pict_hits = hits[current] || null
    let pict = picturesShort[current] || null
    return Object.assign({}, pict, {hits: pict_hits})
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
    next = next < length ? next : 0
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
  clientSide: clientSideSelector,
  current: lightboxCurrentPictSelector,
  currentIndex: lightboxCurrentIndexSelector,
  currentLoaded: lightboxCurrentLoadedSelector,
  next: lightboxNextPictSelector,
  nextLoaded: lightboxNextLoadedSelector,
  previous: lightboxPreviousPictSelector,
  previousLoaded: lightboxPreviousLoadedSelector,
  pictures: lightboxPicturesSelector,
  length: lightboxLengthSelector,
  activated: lightboxActivatedSelector,
  slideshow: lightboxSlideshowSelector,
  showInfo: lightboxShowInfoSelector,
  showHits: staffSelector,
})
