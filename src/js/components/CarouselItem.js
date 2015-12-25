import React, { Component, PropTypes } from 'react'


export default class CarouselItem extends Component {
  
  render() {

    let li_classes = []
    this.props.current ? li_classes.push("selected") : ""
    this.props.swaping ? li_classes.push("swaping") : ""

    return (
        <li className={li_classes.join(' ')}
            style={{
              left: this.props.position
            }}><img
             src={'/media/images/previews/height-600/' + this.props.previews_path}
             alt={this.props.legend}
             onClick={() => this.props.onClick(this.props.index)}
             onDoubleClick={() => this.props.onDoubleClick(this.props.pk)}
             height={this.props.height}
             width={this.props.width}
             title="Double click me !"
             /></li>
    )
  }
}

CarouselItem.PropTypes = {
  previews_path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  legend: PropTypes.string.isRequired,
  ratio: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  current: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
}
