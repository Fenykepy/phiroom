import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class CarouselItem extends Component {

  getWidth() {
    if (this.refs.li) {
      return this.refs.li.offsetWidth
    }
    return 0
  }

  render() {

    //console.log('carousel item', this.props)
    console.log(this.props.translate)

    let style = {
      left: this.props.left,
      transform: "translateX(" + this.props.translate + "px)",
    }

    let img = (
      <img
         src={'/media/images/previews/height-600/' + this.props.previews_path}
         alt={this.props.legend}
         onLoad={this.props.onLoad}
      />
    )
    // if we have current picture return it with lightbox link wrapper
    if (this.props.current) {
      return (
        <li
          ref="li"
          className="selected"
          style={style}
        >
          <Link to={this.props.lightboxLink}>
            {img}
          </Link>
        </li>
      )
    }

    // else return it
    return (
      <li
        ref="li"
        style={style}
        className={this.props.swapping ? "swapping" : ""}
        onClick={this.props.onClick}>
        {img}
      </li>
    )
  }
}
