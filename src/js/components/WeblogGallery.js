import React, { Component, PropTypes } from 'react'

import WeblogGalleryItem from './WeblogGalleryItem'

export default class WeblogGallery extends Component {
  render() {
    let gallery = ''
    if (this.props.pictures) {
      gallery = (
        <ul className="gallery-inline">
          {this.props.pictures.map((item) =>
              <WeblogGalleryItem key={item.previews_path} {...item} path={this.props.path} />
          )}
        </ul>
      )
    }

    return gallery
  }
}
