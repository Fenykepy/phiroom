import { createSelector, createStructuredSelector } from 'reselect'


/*
 * input selectors
 */
const picturesShortSelector = state => state.pictures.short

const lightboxPicturesSelector = state => state.lightbox.pictures

const lightboxCurrentSelector = state => state.lightbox.current

const lightboxActivatedSelector = state => state.lightbox.activated

const lightboxSlideshowSelector = state => state.lightbox.slideshow

const lightboxShowInfoSelector = state => state.lightbox.showInfo

const lightboxLengthSelector = state => state.lightbox.pictures.length

const lightboxCurrentPictSelector = createSelector(
  lightboxCurrentSelector,
  picturesShortSelector,
  (current, pictures) => {
    return pictures[current] || null
  }
)

const lightboxPrevPictSelector = createSelector(
  lightboxCurrentSelector,
  lightboxLengthSelector,
  picturesShortSelector,
  (current, length, pictures) => {
    return pictures[current] || null
  }
)

const lightboxNextPictSelector = createSelector(
  lightboxCurrentSelector,
  lightboxLengthSelector,
  picturesShortSelector,
  (current, length, pictures) => {
    return pictures[current] || null
  }
)

export const lightboxSelector = createStructuredSelector({
  current: lightboxCurrentPictSelector,
  next: lightboxNextPictSelector,
  previous: lightboxPreviousPictSelector,
  length: lightboxLengthSelector,
  activated: lightboxActivatedSelector,
  slideshow: lightboxSlideshowSelector,
  showInfo: lightboxShowInfoSelector,
})
