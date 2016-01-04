import React, { Component, PropTypes } from 'react'

import LibrairyPicturesListItem from './LibrairyPicturesListItem'

import { selectPicture } from '../actions/librairy'

export default class LibrairyPicturesList extends Component {

  handleClick(picture) {
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
