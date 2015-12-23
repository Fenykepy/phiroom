import React, { Component, PropTypes } from 'react'

import {
  lightboxStop,
  lightboxNavTo,
  lightboxToogleSlideshow,
  lightboxTooglePictInfo,
} from '../actions/lightbox'
import Spinner from './Spinner'


export default class Lightbox extends Component {
  
  componentWillUnmount() {
    this.props.dispatch(lightboxStop())
  }

  getBasePath() {
    return this.props.location.pathname.split('/lightbox/')[0]
  }

  handleBgClick(e) {
    this.props.history.pushState(null, this.getBasePath() + '/')
  }

  handlePrevClick(e) {
    this.props.history.pushState(null, this.getBasePath() +
      '/lightbox/' + this.props.previous + '/')
  }

  handleNextClick(e) {
    this.props.history.pushState(null, this.getBasePath() +
      '/lightbox/' + this.props.next + '/')
  }

  render() {
    let current = null
    let child
    if (current) {
      child = (
        <div>
          <div id="lb-overlay"></div>
          <section id="lightbox" onClick={this.handleBgClick.bind(this)}>
            <figure id="lb-new">
              <div className="lb-buttons-wrapper">
                <img src={'/media/images/previews/large/' + current.previews_path} alt={current.title} />
                <button id="lb-previous" onClick={this.handlePrevClick.bind(this)}>Previous picture</button>
                <button id="lb-next" onClick={this.handleNextClick.bind(this)}>Next picture</button>
              </div>
              <figcaption>
                {current.title}
                <p>Image {this.state.index + 1} of {this.props.pictures.length}</p>
              </figcaption>
            </figure>
          </section>
        </div>
      )
    } else child = (<div />)

    return child
  }
}
