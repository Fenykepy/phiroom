import React, { Component, PropTypes } from 'react'

export default class WeblogDescription extends Component {
  render() {
    if (this.props.description) {
      return (
          <p className="description">{this.props.description}</p>
      )
    }
    return null
  }
}
