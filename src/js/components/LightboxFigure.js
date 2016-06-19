import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import Spinner from './Spinner'
import HitsCounter from './HitsCounter'

export default class LightboxFigure extends Component {

  getHits() {
    if (this.props.showHits) {
      return (
        <HitsCounter
          hits={this.props.image.hits}
        />
      )
    }
  }


  render () {
    // if we are clientside and image is loading, show spinner
    if (! this.props.loaded && this.props.clientSide) {
      //console.log('loading')
       return (
        <figure>
          <Spinner />
        </figure>
      )
    }
    return (
          <figure key={this.props.image.previews_path}>
            <div className="lb-buttons-wrapper">
                <img src={'/media/images/previews/large/' + this.props.image.previews_path}
                   alt={this.props.image.title}
                 />
              <Link id="lb-previous" to={this.props.previous_path}>
                <span className="accessibility">Previous picture</span>
              </Link>
              <Link id="lb-next" to={this.props.next_path}>
                <span className="accessibility">Next picture</span>
              </Link>
            </div>
            <figcaption>
              <div className="lb-title"><div>{this.props.image.title}</div>{this.getHits()}</div>
              <p>Image {this.props.number} of {this.props.length}</p>
            </figcaption>
          </figure>
    )
  }
}
