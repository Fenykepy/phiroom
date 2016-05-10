import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class CarouselItem extends Component {

  constructor(props) {
    super(props)
    
    // keep track of image load
    this.state = {imageLoaded: false}
  }

  getWidth() {
    // return picture width
    if (this.refs.li) {
      return this.refs.li.offsetWidth
    }
    return 0
  }

  onLoad() {
    // launch carousel onLoad on image load
    if (! this.state.imageLoaded) {
      this.setState({imageLoaded: true})
      this.props.onLoad()
    }
  }

  render() {

    //console.log('carousel item', this.props)
    let style = {
      left: this.props.left,
      transform: "translateX(" + this.props.translate + "px)",
    }

    let img = (
      <img
         src={'/media/images/previews/height-600/' + this.props.previews_path}
         alt={this.props.legend}
         onLoad={this.onLoad.bind(this)}
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
        className={this.props.swaping ? "swaping" : ""}
        onClick={this.props.onClick}>
        {img}
      </li>
    )
  }
}
