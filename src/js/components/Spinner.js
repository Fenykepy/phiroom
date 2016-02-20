import React, { Component, PropTypes } from 'react'

/*
 * using a svg spinner optimized with svgo rotating with css3
 * we pass from 8kb to 4kb
 */
export default class Spinner extends Component {
  render() {

    return (
      <div className="spinner">
          <img src="/assets/images/spinner.svg" alt="spinner" height="40px"/>
        <p><em>{this.props.message}</em></p>
      </div>
    )
  }
}

