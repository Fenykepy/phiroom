import React, { Component, PropTypes } from 'react'
import CarouselInlineItem from './CarouselInlineItem'


export default class CarouselInline extends Component {
  
  render() {
    
    return (
        <ul className="carousel-inline">
          {this.props.pictures.map((item) =>
          <CarouselInlineItem key={item.previews_path} {...item} path={this.props.path} />
      )}
        </ul>
    )
  }
}


CarouselInline.PropTypes = {
  pictures: PropTypes.arrayOf(PropTypes.shape({
    previews_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired).isRequired
}
