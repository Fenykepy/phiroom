import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import { setLightboxLink } from '../helpers/urlParser'

export default class WeblogGalleryItem extends Component {
  
  render() {

    return (
      <li><Link
        to={setLightboxLink(
          this.props.path, this.props.sha1
        )}
      ><img
          src={'/media/images/previews/height-600/' + this.props.previews_path}
          alt={this.props.legend}
      /></Link></li>
    )
  }
}
