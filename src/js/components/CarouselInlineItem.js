import React, { Component, PropTypes } from 'react'


export default class CarouselInlineItem extends Component {
  
  getLightboxPath(sha1) {
    let path = this.props.path
    if (path.slice(-1) != '/') {
      path = path + '/'
    }
    return path + 'lightbox/' + sha1 + '/'
  }

  render() {
    //console.log('carousel inline item', this.props)
    return (
      <li><a href={this.getLightboxPath(this.props.sha1)}
          ><img src={'/media/images/previews/height-600/' + this.props.previews_path}
            alt={this.props.legend} /></a></li>
    )
  }
}

CarouselInlineItem.PropTypes = {
  previews_path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
}
