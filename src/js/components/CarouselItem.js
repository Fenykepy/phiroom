import React, { Component, PropTypes } from 'react'


export default class CarouselItem extends Component {

  componentDidMount () {
    //console.log(this.refs.offsetWidth)
    console.log(this.props.position)
  }
  render() {
    return (
        <li className={this.props.current ? "selected":""}
            style={{
              left: this.props.position
            }}><img
             className={this.props.swiped ? "swiped": ""}
             src={'/media/images/previews/height-600/' + this.props.previews_path}
             alt={this.props.legend}
             onClick={()=> this.props.onClick(this.props.index)}
             height={this.props.height}
             width={this.props.width}
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
  current: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
}
