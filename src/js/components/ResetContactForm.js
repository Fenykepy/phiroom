import React, { Component, PropTypes } from 'react'


export default class ResetContactForm extends Component {
  render() {
    return (
      <div className="info">
        <p><em>Your message has been sent.</em></p>
        <button onClick={this.props.resetForm}>Ok</button>
      </div>
    )
  }
}
