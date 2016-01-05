import React, { Component, PropTypes } from 'react'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'

import {
  selectPicture,
  unselectAll,
} from '../actions/librairy'

export default class LibrairyPicturesList extends Component {

  handleClick(picture) {
    // if ctrl key was pressed, toggle picture selection
    // if shift key was pressed, select all pictures between selected and clicked
    // unselect all and select picture
    this.props.dispatch(unselectAll(picture))
    this.props.dispatch(selectPicture(picture))
  }

  render() {
    console.log('picturesList', this.props)
    return (
      <section id="librairy-list">
        {this.props.pictures.map((pict) =>
          <LibrairyPicturesListItem
            key={pict.pk}
            handleClick={this.handleClick.bind(this)}
            columns_width={this.props.columns_width}
            {...pict}
          />
        )}
      </section>
    )
  }
}
