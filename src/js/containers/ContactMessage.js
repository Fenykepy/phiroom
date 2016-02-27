import React, { Component, Proptypes } from 'react'


import { connect } from 'react-redux'


import { contactMessageSelector } from '../selectors/contactMessageSelector'

import ResetContactForm from '../components/ResetContactForm'
import Spinner from '../components/Spinner'
import ContactMessageForm from '../components/ContactMessageForm'

import {
  messageSetName,
  messageSetEmail,
  messageSetWebsite,
  messageSetSubject,
  messageSetMessage,
  messageSetForward,
  postMessage,
  resetMessage,
} from '../actions/contact'

class ContactMessage extends Component {

  handleSubmit(e) {
    e.preventDefault()
    this.props.dispatch(postMessage())
      .catch(error =>
          console.log(error)
      )
  }

  handleReset() {
    this.props.dispatch(resetMessage())
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


  render() {
    // injected by connect() call:
    const {
      dispatch,
      message,
      user,
      csrf
    } = this.props

    if (this.props.message.is_posting) {
      // show spinner
      return (<Spinner message="Sending message..." />)
    }

    if (this.props.message.posted) {
      // show validation text
      return (<ResetContactForm handleReset={this.handleReset.bind(this)} />)
    }

    //console.log('contact message', this.props)
     
    // show form
    return (
      <ContactMessageForm
        handleSubmit={this.handleSubmit.bind(this)} 
        handleNameChange={this.handleNameChange.bind(this)} 
        handleEmailChange={this.handleEmailChange.bind(this)} 
        handleWebsiteChange={this.handleWebsiteChange.bind(this)} 
        handleSubjectChange={this.handleSubjectChange.bind(this)} 
        handleMessageChange={this.handleMessageChange.bind(this)} 
        handleForwardChange={this.handleForwardChange.bind(this)} 
        csrf={this.props.csrf}
        user={this.props.user}
        {...this.props.message}
      />
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(contactMessageSelector)(ContactMessage)

