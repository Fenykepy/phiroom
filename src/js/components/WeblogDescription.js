import React, { Component, PropTypes } from 'react'

export default class WeblogDescription extends Component {
  render() {
    let description = ''
    if (this.props.description) {
      description = (
          <p className="description">{this.props.description}</p>
      )
    }

    return description
  }
}
