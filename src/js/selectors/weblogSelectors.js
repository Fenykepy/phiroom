import { createSelector, createStructuredSelector } from 'reselect'




/*
 * input selectors
 */
const picturesShortSelector = state => state.pictures.short

const selectedPageSelector = state => state.weblog.pages[
  state.weblog.selectedPage]

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
  selectedPost: selectedPostSelector,
  n_pictures: postPicturesNumberSelector,
  pictures: postPicturesSelector,
})
