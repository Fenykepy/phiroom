import { createSelector, createStructuredSelector } from 'reselect'

import { flatEnsemblesSelector } from './collectionEditionSelector'

const ensembleEditedSelector = state => state.librairy.collection.editedEnsemble

export const ensembleEditionSelector = createStructuredSelector({
  edited: ensembleEditedSelector,
  ensembles: flatEnsemblesSelector,
})
