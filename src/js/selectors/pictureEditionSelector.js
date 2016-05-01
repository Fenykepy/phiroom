import { createSelector, createStructuredSelector } from 'reselect'

const pictureEditedSelector = state => state.common.pictures.edited

export const pictureEditionSelector = createStructuredSelector({
  edited: pictureEditedSelector,
})
