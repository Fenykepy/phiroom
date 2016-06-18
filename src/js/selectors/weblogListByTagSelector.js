import { createSelector, createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { hitsSelector } from './weblogDetailSelector'

const pagesByTagSelector = state => state.weblog.pagesByTag
const selectedPageByTagDataSelector = state => state.weblog.selectedPageByTag

const selectedPageByTagSelector = createSelector(
  pagesByTagSelector,
  selectedPageByTagDataSelector,
  (pages, selected) => {
    if (selected && selected.page && selected.tag) {
      return pages[selected.tag][selected.page]
    }
    return null
  }
)


export const weblogListByTagSelector = createStructuredSelector({
  selectedPageByTag: selectedPageByTagSelector,
  user: userSelector,
  hits: hitsSelector,
})
