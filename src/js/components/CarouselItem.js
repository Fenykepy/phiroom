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
         style={{height: this.props.height}}
      />
    )
    // if we have current picture return it with lightbox link wrapper
    if (this.props.current) {

      let play = (
        <div className="play"></div>
      )
      let pause = (
        <div className="pause"></div>
      )
      return (
        <li
          ref="li"
          className="selected"
          style={style}
          title="Open in lightbox"
        >
          <Link to={this.props.lightboxLink}>
            {img}
          </Link>
          <button
            className="overlay slideshow"
            onClick={this.props.toggleSlideshow}
            title="Toggle slideshow"
          ><span className="accessibility">Toggle slideshow</span>
          {this.props.slideshow ? pause : play}</button>
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
