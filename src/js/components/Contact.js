import React, { Component, PropTypes } from 'react'

import AuthenticatedContactForm from './AuthenticatedContactForm'
import AnonymousContactForm from './AnonymousContactForm'
import Spinner from './Spinner'
import ResetContactForm from './ResetContactForm'

import { fetchDescriptionIfNeeded } from '../actions/contact'
import { fetchCSRFTokenIfNeeded } from '../actions/common'
import { postMessage, resetMessage } from '../actions/contact'
import { setModule } from '../actions/modules'

export default class Contact extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // get description
    promises.push(dispatch(fetchDescriptionIfNeeded()))
    // get csrfToken
    promises.push(dispatch(fetchCSRFTokenIfNeeded()))
    return promises  
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    // set module
    if (this.props.modules.current != 'contact') {
      this.props.dispatch(setModule('contact'))
    }
  }

  handleMessageSubmit(message) {
    this.props.dispatch(postMessage(message))
  }

  resetForm() {
    console.log('reset')
    this.props.dispatch(resetMessage())
  }

  render() {
    let form, child
    // if (this.props.user.is_authenticated) {
    //  form = (<AuthenticatedContactForm />)
    // } else {
        form = (<AnonymousContactForm
            csrf={this.props.common.csrfToken.token}
            handleSubmit={this.handleMessageSubmit.bind(this)}
            {...this.props.contact.message}
        />)
    // }
    if (this.props.contact.message.is_posting) {
      // show spinner
      child = (<Spinner message="Sending message…" />)
    } else if (this.props.contact.message.posted) {
      // show validation text
      child = (<ResetContactForm resetForm={this.resetForm.bind(this)} />)
    } else {
      child = form
    }
    return (
      <section role="main">
        <h1>{this.props.contact.description.title}</h1>
        <span dangerouslySetInnerHTML={{__html: this.props.contact.description.content}} />
        {/* insert follow links here */}
        <h1>Leave me a message</h1>
        {child}
      </section>
    )
  }
}
