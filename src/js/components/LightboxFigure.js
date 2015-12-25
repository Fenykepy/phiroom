import React, { Component, PropTypes } from 'react'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { Link } from 'react-router'
import Spinner from './Spinner'

export default class LightboxFigure extends Component {

  render () {
    /*if (! this.props.loaded) {
       return (
        <figure>
          <Spinner />
        </figure>
      )
      }*/
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
              {this.props.image.title}
              <p>Image {this.props.number} of {this.props.length}</p>
            </figcaption>
          </figure>
    )
  }
}
