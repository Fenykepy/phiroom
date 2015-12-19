import React, { Component, PropTypes } from 'react'

export default class WeblogGalleryItem extends Component {
  render() {
    return (<li><img src={'/media/images/previews/height-600/' + this.props.previews_path}
      alt={this.props.legend} /></li>
    )
  }
}
