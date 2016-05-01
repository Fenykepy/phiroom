import React, { Component, PropTypes } from 'react'

import WeblogGalleryItem from './WeblogGalleryItem'

export default class WeblogGallery extends Component {
  render() {
    if (this.props.pictures) {
      return (
        <ul className="gallery-inline">
          {this.props.pictures.map((item) =>
              <WeblogGalleryItem key={item.previews_path} {...item} path={this.props.path} />
          )}
        </ul>
      )
    }
    
    return null
  }
}
