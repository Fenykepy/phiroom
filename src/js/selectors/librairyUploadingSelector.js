import { createSelector, createStructuredSelector } from 'reselect'

// total number of pictures to import
const countSelector = state => state.common.pictures.uploading.status.count

// number of pictures not imported yet
const remainSelector = state => state.common.pictures.uploading.status.remain

// failed pictures
const failsSelector = state => state.common.pictures.uploading.status.fails

// number of uploaded pictures
const uploadedSelector = createSelector(
  countSelector,
  remainSelector,
  (count, remain) => {
    return count - remain + 1
  }
)

// if remain == 0, uploading is finish
const uploadingSelector = createSelector(
  remainSelector,
  (remain) => {
    return remain > 0
  }
)

export const librairyUploadingSelector = createStructuredSelector({
  count: countSelector,
  uploaded: uploadedSelector,
  uploading: uploadingSelector,
  fails: failsSelector,
})
