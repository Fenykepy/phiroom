import React, { Component, PropTypes } from 'react'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'

import {
  selectPicture,
  unselectPicture,
  unselectAll,
} from '../actions/librairy'

export default class LibrairyPicturesList extends Component {

  handleClick(picture, ctrlKey, shiftKey) {
    let pict = this.props.pictures[picture]
    // if ctrl key was pressed, toggle picture selection
    if (ctrlKey) {
      if (pict.selected) {
        return this.props.dispatch(unselectPicture(pict.pk))
      }
      return this.props.dispatch(selectPicture(pict.pk))
    }
    // if shift key was pressed, select all pictures between selected and clicked
    // unselect all and select picture
    this.props.dispatch(unselectAll(picture))
    return this.props.dispatch(selectPicture(pict.pk))
  }

  render() {
    //console.log('picturesList', this.props)
    return (
      <section id="librairy-list">
        {this.props.pictures.map((pict, index) =>
          <LibrairyPicturesListItem
            key={pict.pk}
            index={index}
            handleClick={this.handleClick.bind(this)}
            columns_width={this.props.columns_width}
            {...pict}
          />
        )}
      </section>
    )
  }
}
