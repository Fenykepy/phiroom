import { createSelector, createStructuredSelector } from 'reselect'




/*
 * input selectors
 */
const picturesShortSelector = state => state.pictures.short

const selectedPageSelector = state => state.weblog.pages[
  state.weblog.selectedPage]


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

const selectedPostSelector = state => state.weblog.posts[
  state.weblog.selectedPost]



const postPicturesNumberSelector = createSelector(
    selectedPostSelector,
    (selectedPost) => {
      if (selectedPost && selectedPost.pictures) {
        return selectedPost.pictures.length
      }
      return 0
    }
)


const authorsSelector = state => state.authors

const postAuthorSelector = createSelector(
  selectedPostSelector,
  authorsSelector,
  (selectedPost, authors) => {
    if (selectedPost && authors[selectedPost.author]) {
      return authors[selectedPost.author]
    }
    return {}
  }
)

const postPicturesSelector = createSelector(
    selectedPostSelector,
    picturesShortSelector,
    (selectedPost, picturesShort) => {
      if (selectedPost && selectedPost.pictures) {
        let picts = []
        selectedPost.pictures.forEach(pict => {
          if (picturesShort[pict] && picturesShort[pict].fetched) {
            picts.push(picturesShort[pict])
          }
        })
        return picts
      }
      else return []
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
