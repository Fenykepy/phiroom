import { createSelector, createStructuredSelector } from 'reselect'


import { userSelector } from './userSelector'


// draged element
const dragSelector = state => state.librairy.drag

// pictures full data database
const picturesSelector = state => state.common.pictures.full

// 
export const librairySelector = createStructuredSelector({
  user: userSelector,
  drag: dragSelector,

})
