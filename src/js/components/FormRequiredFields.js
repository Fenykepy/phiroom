import React, { Component, PropTypes } from 'react'

export default class FormRequiredFields extends Component {

  render() {
    return (
      <p><span className="red">*</span> : required fields.</p>
    )
  }
}
