import React, { Component, Proptypes } from 'react'


import { connect } from 'react-redux'

import { contactMessageSelector } from '../selectors/contactMessageSelector'

import {
  messageSetName,
  messageSetEmail,
  messageSetWebsite,
  messageSetSubject,
  messageSetMessage,
  messageSetForward,
  postMessage,
} from '../actions/contact'

class ContactMessageForm extends Component {

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(postMessage())
  }

  handleNameChange(e) {
    this.props.dispatch(messageSetName(e.target.value))
  }
 
  handleEmailChange(e) {
    this.props.dispatch(messageSetEmail(e.target.value))
  } 

  handleWebsiteChange(e) {
    this.props.dispatch(messageSetWebsite(e.target.value))
  }

  handleSubjectChange(e) {
    this.props.dispatch(messageSetSubject(e.target.value))
  }

  handleMessageChange(e) {
    this.props.dispatch(messageSetMessage(e.target.value))
  }

  handleForwardChange(e) {
    this.props.dispatch(messageSetForward(! this.props.message.forward))
  }

  getFieldErrors(field = 'non_field_errors') {
    if (this.props.message.errors && this.props.message.errors[field]) {
      let errors = this.props.message.errors[field]
      return (
        <ul className="error-list">
          {errors.map(error =>
            <li
              key={error}
            >{error}</li>
          )}
        </ul>
      )
    }
    return null
  }


  render() {
    // injected by connect() call:
    const {
      dispatch,
      message,
    } = this.props

    return (
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(contactMessageSelector)(ContactMessageForm)

