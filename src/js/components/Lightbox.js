import React, { Component, PropTypes } from 'react'

import {
  lightboxStop,
  lightboxNavTo,
  lightboxToogleSlideshow,
  lightboxTooglePictInfo,
  lightboxCurrentLoaded,
  lightboxNextLoaded,
  lightboxPreviousLoaded,
} from '../actions/lightbox'

import { Link } from 'react-router'

function loadImage(src) {
  let img = new Image()
  let promise = new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
  })
  img.src = src
  return promise
}

export default class Lightbox extends Component {

  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
  }

  loadImages() {
    let base_src = '/media/images/previews/large/'
    // load current image first
    this.loadCurrent(base_src)
      .then(() =>
        this.loadNext(base_src)
          .then(() =>
            this.loadPrevious(base_src)
          )
      )
  }

  loadCurrent(base_src) {
    // if image is already loaded, return resolved promise
    if (this.props.currentLoaded) {
      return new Promise((resolve, reject) => resolve())
    }
    if (this.props.current) {
      return loadImage(base_src + this.props.current.previews_path)
        .then((image) => {
            this.props.dispatch(lightboxCurrentLoaded())
            return image
        })
    }
  }

  loadNext(base_src) {
    // if image is already loaded, return resolved promise
    if (this.props.nextLoaded) {
      return new Promise((resolve, reject) => resolve())
    }
    if (this.props.next) {
      return loadImage(base_src + this.props.next.previews_path)
        .then((image) => {
          this.props.dispatch(lightboxNextLoaded())
          return image
        })
    }
  }
 
  loadPrevious(base_src) {
    // if image is already loaded, return resolved promise
    if (this.props.previousLoaded) {
      return new Promise((resolve, reject) => resolve())
    }
    if (this.props.previous) {
      return loadImage(base_src + this.props.previous.previews_path)
        .then((image) => {
          this.props.dispatch(lightboxNextLoaded())
          return image
        })
    }
  }   


  getBasePath() {
    let path = this.props.location.pathname.split('/lightbox/')[0]
    if (path.slice(-1) == '/') {
      path = path.slice(0, -1)
    }
    return path
  }

  getClosePath() {
    return this.getBasePath() + '/'
  }

  getPreviousPath() {
    if (this.props.previous) {
      return this.getBasePath() +
        '/lightbox/' + this.props.previous.pk + '/'
    }
    return ""
  }

  getNextPath() {
    if (this.props.next) {
      return this.getBasePath() +
        '/lightbox/' + this.props.next.pk + '/'
    }
    return "" 
  }

  render() {
    if (! this.props.activated || ! this.props.current) {
      return (<div />)
    }
    this.loadImages()
    return (
        <div>
          <div id="lb-overlay"></div>
          <section id="lightbox">
          <Link id="lb-close" to={this.getClosePath()} title="Close lightbox"></Link>
            <figure id="lb-new">
              <div className="lb-buttons-wrapper">
                <img src={'/media/images/previews/large/' + this.props.current.previews_path}
                     alt={this.props.current.title}
                />
                <Link id="lb-previous" to={this.getPreviousPath()}>
                  <span className="accessibility">Previous picture</span>
                </Link>
                <Link id="lb-next" to={this.getNextPath()}>
                  <span className="accessibility">Next picture</span>
                </Link>
              </div>
              <figcaption>
                {this.props.current.title}
                <p>Image {this.props.currentIndex + 1} of {this.props.pictures.length}</p>
              </figcaption>
            </figure>
          </section>
        </div>
      )
  }
}
