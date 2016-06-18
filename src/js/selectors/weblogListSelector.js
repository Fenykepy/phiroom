import { createStructuredSelector } from 'reselect'

import { userSelector } from './userSelector'
import { hitsSelector } from './weblogDetailSelector'

const selectedPageSelector = state => state.weblog.pages[
  state.weblog.selectedPage
]

export const weblogListSelector = createStructuredSelector({
  selectedPage: selectedPageSelector,
  user: userSelector,
  hits: hitsSelector,
})
