import React, { Component, PropTypes } from 'react'


export default class ResetContactForm extends Component {
  render() {
    return (
      <div>
        <div className="info"><em>Your message has been sent.</em></div>
        <div className="centered">
          <button
            className="primary"
            onClick={this.props.handleReset}>Ok</button>
        </div>
      </div>
    )
  }
}
