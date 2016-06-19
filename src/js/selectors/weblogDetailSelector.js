import { createSelector, createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'

/*
 * selectedPost
 * selectedPost.author
 * selectedPost.pictures
 * 
 */

/*
 * input selectors
 */

// all public pictures from store
const picturesShortSelector = state => state.common.pictures.short

// all authors from store
const authorsSelector = state => state.common.authors

// all posts hits
export const hitsSelector = state => state.weblog.hits

// post object from store
const selectedPostSelector = state => state.weblog.posts[
  state.weblog.selectedPost
]

const postHitsSelector = createSelector(
  selectedPostSelector,
  hitsSelector,
  (selectedPost, hits) => {
    if (selectedPost && hits && hits[selectedPost.slug]) {
      return hits[selectedPost.slug]
    }
    return null
  }
)

// post list of picture's sha1s
const postPicturesListSelector = createSelector(
  selectedPostSelector,
  (selectedPost) => {
    if (selectedPost) {
      return selectedPost.pictures
    }
    return []
  }
)

// post number of pictures
const postPicturesNumberSelector = createSelector(
    selectedPostSelector,
    (selectedPost) => {
      if (selectedPost && selectedPost.pictures) {
        return selectedPost.pictures.length
      }
      return 0
  }
)

// post author object
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

// post pictures objects
const postPicturesSelector = createSelector(
    selectedPostSelector,
    picturesShortSelector,
    (selectedPost, picturesShort) => {
      let pictures = []
      if (selectedPost && selectedPost.pictures) {
        selectedPost.pictures.forEach(pict => {
          if (picturesShort[pict] && picturesShort[pict].fetched) {
            pictures.push(picturesShort[pict])
          }
        })
      }
      return pictures
    }
)




export const weblogDetailSelector = createSelector(
  selectedPostSelector,
  postPicturesNumberSelector,
  postPicturesListSelector,
  postAuthorSelector,
  postPicturesSelector,
  userSelector,
  postHitsSelector,
  (selected, n_picts, pictsList, author, pictures, user, postHits) => {
    return Object.assign({},
        selected,
        {picturesList: pictsList},
        {author: author},
        {n_pictures: n_picts},
        {pictures: pictures},
        {user: user},
        {hits: postHits}
    )
  }
)
