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


export default class Lightbox extends Component {

  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
  }

  loadImages() {
    // load current image file first
    this.loadImage(
      this.props.current,
      this.props.currentLoaded,
      lightboxCurrentLoaded)
      .then(() =>
        this.loadImage( // then load next image file
          this.props.next,
          this.props.nextLoaded,
          lightboxNextLoaded)
          .then(() => // load previous image file last
            this.loadImage(
              this.props.previous,
              this.props.previousLoaded,
              lightboxPreviousLoaded)
          )
      )
  }


  loadImage(image, loaded, action) {
    let base_src = '/media/images/previews/large/'
    // if image is already loaded, return resolved promise
    if (loaded) {
      return new Promise((resolve, reject) => resolve())
    }
    // if we have image datas
    if (image) {
      let img = new Image()
      let promise = new Promise((resolve, reject) => {
        img.onload = () => resolve(img)
      })
      img.src = base_src + image.previews_path
      return promise.then((image) => {
        this.props.dispatch(action())
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
