import { createSelector, createStructuredSelector } from 'reselect'




/*
 * input selectors
 */

const selectedPageSelector = state => state.weblog.pages[
  state.weblog.selectedPage]

const selectedPostSelector = state => state.weblog.posts[
  state.weblog.selectedPost]

export const weblogSelector = createStructuredSelector({
  selectedPage: selectedPageSelector,
  selectedPost: selectedPostSelector
})
