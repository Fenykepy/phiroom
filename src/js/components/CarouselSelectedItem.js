import React, { Component, PropTypes } from 'react'


export default class CarouselSelectedItem extends Component {
  render() {
    return (
        <li className="selected"><img src={'/media/images/previews/height-600/' + this.props.previews_path}
             alt={this.props.legend} /></li>
    )
  }
}


CarouselSelectedItem.PropTypes = {
  previews_path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
}
