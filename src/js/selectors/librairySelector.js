import { createSelector, createStructuredSelector } from 'reselect'


import { userSelector } from './userSelector'

// librairy current displayed element title
const titleSelector = state => state.librairy.title

// draged element
const dragSelector = state => state.librairy.drag

// pictures full data database
const picturesSelector = state => state.common.pictures.full


// selected pictures in librairy
const selectedSelector = state => state.librairy.selected

// number of selected pictures
const selectedNumberSelector = state => state.librairy.selected.length

// number of displayed pictures
const displayedNumberSelector = state => state.librairy.pictures.length

// width of left panel
const leftPanelWidthSelector = state => state.librairy.left_panel_width

// width of right panel
const rightPanelWidthSelector = state => state.librairy.right_panel_width

// number of images per line in list
const columnsSelector = state => state.librairy.columns

// width of viewport
const viewportWidthSelector = state => state.common.viewport.width

// modules (for headers)
import { modulesSelector } from './modulesSelector'

// settings (for headers)
import { settingsSelector } from './settingsSelector'


// displayed pictures in librairy
const displayedSelector = state => state.librairy.pictures

// librairy fetching
const fetchingSelector = state => state.librairy.fetching




// list of all displayed pictures full datas
const librairyPicturesSelector = createSelector(
    picturesSelector,
    displayedSelector,
    (pictures, displayed) => {
      if (pictures && displayed) {
        let picts = []
        displayed.forEach((pict) => {
          // if picture has been fetched
          if (pictures[pict] && pictures[pict].fetched) {
            // push it to array
            picts.push(pictures[pict])
          }
        })
        return picts
      }
      return []
    }
)



// list of all displayed pictures full datas, adding selected property
const librairySelectedPicturesSelector = createSelector(
    selectedSelector,
    librairyPicturesSelector,
    (selected, pictures) => {
      let picts = []
      pictures.forEach((pict) => {
        let index = selected.indexOf(pict.sha1)
        // picture is selected
        if (index > -1) {
          picts.push(Object.assign({}, pict, {
            selected: true
          }))
        // picture is not selected
        } else {
          picts.push(Object.assign({}, pict, {
            selected: false
          }))
        }
      })
      return picts
    }
)


// margin between pictures wrapper elements
const PICTURES_MARGIN = 10

// width in pixels of each thumbs columns
const columnsWidthSelector = createSelector(
    columnsSelector,
    viewportWidthSelector,
    leftPanelWidthSelector,
    rightPanelWidthSelector,
    (n_columns, vw, left_panel_width, right_panel_width) => {
      return Math.floor((vw - left_panel_width - right_panel_width - PICTURES_MARGIN) / n_columns ) - PICTURES_MARGIN
    }
)





export const librairySelector = createStructuredSelector({
  title: titleSelector,
  user: userSelector,
  modules: modulesSelector,
  settings: settingsSelector,
  drag: dragSelector,
  pictures: librairySelectedPicturesSelector,
  selected_list: selectedSelector,
  n_selected: selectedNumberSelector,
  n_pictures: displayedNumberSelector,
  n_columns: columnsSelector,
  columns_width: columnsWidthSelector,
  left_panel_width: leftPanelWidthSelector,
  right_panel_width: rightPanelWidthSelector,
  fetching: fetchingSelector,
})
