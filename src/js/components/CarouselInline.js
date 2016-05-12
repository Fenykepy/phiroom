import React, { Component, PropTypes } from 'react'
import CarouselInlineItem from './CarouselInlineItem'


export default class CarouselInline extends Component {
  
  render() {
    return (
      <ul className="carousel-inline">
        {this.props.pictures.map(pict =>
          <CarouselInlineItem
            key={pict.previews_path}
            title={pict.title}
            sha1={pict.sha1}
            previews_path={pict.previews_path}
            pathname={this.props.pathname}
          />
        )}
      </ul>
    )
  }
}


CarouselInline.PropTypes = {
  pictures: PropTypes.arrayOf(
    PropTypes.shape({
      previews_path: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sha1: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  pathname: PropTypes.string.isRequired
}
