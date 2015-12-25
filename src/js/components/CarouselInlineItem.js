import React, { Component, PropTypes } from 'react'


export default class CarouselInlineItem extends Component {
  
  getLightboxPath(pk) {
    let path = this.props.path
    if (path.slice(-1) != '/') {
      path = path + '/'
    }
    return path + 'lightbox/' + pk + '/'
  }

  render() {
    return (
      <li><a href={this.getLightboxPath(this.props.pk)}
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
