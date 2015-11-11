import React, { Component, PropTypes } from 'react'


export default class CarouselInlineItem extends Component {
  render() {
    return (
        <li><img src={'/media/images/previews/height-600/' + this.props.previews_path}
             alt={this.props.legend} /></li>
    )
  }
}

CarouselInlineItem.PropTypes = {
  previews_path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
}
