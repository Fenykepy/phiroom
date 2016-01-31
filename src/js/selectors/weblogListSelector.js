import { createStructuredSelector } from 'reselect'

const selectedPageSelector = state => state.weblog.pages[
  state.weblog.selectedPage
]

export const weblogListSelector = createStructuredSelector({
  selectedPage: selectedPageSelector,
})
