import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

import { setLightboxLink } from '../helpers/urlParser'

export default class CarouselItem extends Component {

  constructor(props) {
    super(props)
    
    // keep track of image load
    this.state = {imageLoaded: false}
  }

  componentDidUpdate(prev_props) {
    // trigger load event if height changed
    if (prev_props.height != this.props.height) {
      this.props.onLoad()
    }
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
         alt={this.props.title}
         onLoad={this.onLoad.bind(this)}
         style={{height: this.props.height}}
      />
    )
    // if we have current picture return it with lightbox link wrapper
    if (this.props.current) {

      let lightboxLink= setLightboxLink(this.props.pathname,
        this.props.sha1)

      let play = (
        <div className="play"></div>
      )
      let pause = (
        <div className="pause"></div>
      )
      return (
        <li
          ref="li"
          style={style}
          className="selected"
          title="Open in lightbox"
        >
          <Link to={lightboxLink}>
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

CarouselItem.propTypes = {
  pathname: PropTypes.string.isRequired,
  current: PropTypes.bool.isRequired,
  swaping: PropTypes.bool.isRequired,
  onLoad: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  toggleSlideshow: PropTypes.func.isRequired,
  slideshow: PropTypes.bool.isRequired,
  translate: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  previews_path: PropTypes.string.isRequired,
  sha1: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
