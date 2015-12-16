import React, { Component, PropTypes } from 'react'

export default class Spinner extends Component {
  render() {

    return (
      <div className="spinner">
          <img src="/assets/images/spinner.gif" alt="spinner" height="40px"/>
        <p><em>{this.props.message}</em></p>
      </div>
    )
  }
}

