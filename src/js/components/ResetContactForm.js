import React, { Component, PropTypes } from 'react'


export default class ResetContactForm extends Component {
  render() {
    return (
      <div>
        <div className="info"><em>Your message has been sent.</em></div>
        <div className="centered">
          <button onClick={this.props.resetForm}>Ok</button>
        </div>
      </div>
    )
  }
}
