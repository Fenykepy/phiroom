import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class WeblogGalleryItem extends Component {
  
  setLightboxLink() {
    let url = this.props.path.split('/lightbox/')[0]
    if (url.slice(-1) != "/") {
      url = url + '/'
    }
    return url + 'lightbox/' + this.props.sha1 + '/'
  }

  render() {
    return (<li><Link to={this.setLightboxLink()}><img src={'/media/images/previews/height-600/' + this.props.previews_path}
          alt={this.props.legend} /></Link></li>
    )
  }
}
