import React, { Component, PropTypes } from 'react'

import {
  lightboxStop,
  lightboxNavTo,
  lightboxToogleSlideshow,
  lightboxTooglePictInfo,
} from '../actions/lightbox'

import { Link } from 'react-router'


export default class Lightbox extends Component {
  
  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
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
    console.log('lightbox', this.props)

    if (! this.props.activated || ! this.props.current) {
      return (<div />)
    }
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
                <Link id="lb-previous" to={this.getPreviousPath()}>Previous picture</Link>
                <Link id="lb-next" to={this.getNextPath()}>Next picture</Link>
              </div>
              <figcaption>
                {this.props.current.title}
                <p>Image {this.props.current_index + 1} of {this.props.pictures.length}</p>
              </figcaption>
            </figure>
          </section>
        </div>
      )
  }
}
