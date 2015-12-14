import React, { Component, PropTypes } from 'react'

export default class Spinner extends Component {
  render() {

    return (
      <div className="spinner">
        <img src="/media/images/spinner.gif" alt="spinner" />
        <p><em>{this.props.message}</em></p>
      </div>
    )
  }
}

