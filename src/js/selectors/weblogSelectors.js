import { createSelector, createStructuredSelector } from 'reselect'




/*
 * input selectors
 */


const pagesByTagSelector = state => state.weblog.pagesByTag
const selectedPageByTagDataSelector = state => state.weblog.selectedPageByTag

const selectedPageByTagSelector = createSelector(
  pagesByTagSelector,
  selectedPageByTagDataSelector,
  (pages, selected) => {
    if (selected && selected.page && selected.tag) {
      return pages[selected.tag][selected.page]
    }
    return null
  }
)


export const weblogSelector = createStructuredSelector({
  selectedPage: selectedPageSelector,
  selectedPageByTag: selectedPageByTagSelector,
  selectedPost: selectedPostSelector,
  n_pictures: postPicturesNumberSelector,
  pictures: postPicturesSelector,
  author: postAuthorSelector,
})
