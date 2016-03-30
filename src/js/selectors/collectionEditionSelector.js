import { createSelector, createStructuredSelector } from 'reselect'

const collectionEditedSelector = state => state.librairy.collection.editedCollection

const collectionHeadersSelector = state => state.librairy.collection.headers


function flattenHeaders(ensembles, level) {

}
const ensemblesSelector = createSelector(
  collectionHeadersSelector,
  (headers) => {

  }
)

export const collectionEditionSelector = createStructuredSelector({
  edited: collectionEditedSelector
})
