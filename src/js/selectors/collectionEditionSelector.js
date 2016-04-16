import { createSelector, createStructuredSelector } from 'reselect'

const collectionEditedSelector = state => state.librairy.collection.editedCollection

const collectionHeadersSelector = state => state.librairy.collection.headers.data


function flattenHeaders(depth = -1) {
  return (prevValue, curValue) => {
    prevValue.push({pk: curValue.pk, name: curValue.name, depth: depth})
    return curValue.children.reduce(flattenHeaders(depth + 1), prevValue)
  }
}
const flatEnsemblesSelector = createSelector(
  collectionHeadersSelector,
  (headers) => {
    console.log(headers)
    return flattenHeaders()([], headers)
  }
)

export const collectionEditionSelector = createStructuredSelector({
  edited: collectionEditedSelector,
  ensembles: flatEnsemblesSelector,
})
