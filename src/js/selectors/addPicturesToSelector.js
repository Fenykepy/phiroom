import { createSelector, createStructuredSelector } from 'reselect'

import { portfolioHeadersSelector } from './portfolioSelector'
import { postsHeadersSelector } from './librairyLeftPanelSelector'
import { collectionsHeadersSelector } from './librairyLeftPanelSelector'


function flattenCollections() {
  return (prevValue, curValue) => {
    // we add collections to array
    curValue.collection_set.forEach(item => {
      prevValue.push({id: item.pk, title: item.name})
    })
    // we loop other descendants
    return curValue.children.reduce(flattenCollections(), prevValue)
  }
}

const collectionsIDsSelector = createSelector(
  collectionsHeadersSelector,
  (headers) => {
    return flattenCollections()([], headers)
  }
)

const postsIDsSelector = createSelector(
  postsHeadersSelector,
  (headers) => headers.map(item => {
        return {id: item.slug, title: item.title}
    })
)

const portfoliosIDsSelector = createSelector(
  portfolioHeadersSelector,
  (headers) => headers.map(item => {
        return {id: item.slug, title: item.title}
    })
)

export const addPicturesToSelector = createStructuredSelector({
  collectionsIDs: collectionsIDsSelector,
  postsIDs: postsIDsSelector,
  portfoliosIDs: portfoliosIDsSelector,
})
