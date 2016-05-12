import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { setLightboxLink } from '../helpers/urlParser'

export default class CarouselInlineItem extends Component {
  
  render() {
    //console.log('carousel inline item', this.props)
    let lightboxLink = setLightboxLink(this.props.pathname,
      this.props.sha1)
    
    return (
      <li><Link to={lightboxLink}
          ><img src={'/media/images/previews/height-600/' + this.props.previews_path}
            alt={this.props.title} /></Link></li>
    )
  }
}

CarouselInlineItem.propTypes = {
  pathname: PropTypes.string.isRequired,
  previews_path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
