import React, { Component, PropTypes } from 'react'

import AuthenticatedContactForm from './AuthenticatedContactForm'
import AnonymousContactForm from './AnonymousContactForm'

import { fetchDescriptionIfNeeded } from '../actions/contact'
import { fetchCSRFTokenIfNeeded } from '../actions/common'
import { postMessage } from '../actions/contact'

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
  }

  handleMessageSubmit(message) {
    this.props.dispatch(postMessage(message))
  }

  render() {
    let contactForm
    // if (this.props.user.is_authenticated) {
    //  contactForm = AuthenticatedContactForm
    // } else {
        contactForm = (<AnonymousContactForm
            csrf={this.props.common.csrfToken.token}
            handleSubmit={this.handleMessageSubmit.bind(this)}
        />)
    // }
    return (
      <div>
        <h1>{this.props.contact.description.title}</h1>
        <span dangerouslySetInnerHTML={{__html: this.props.contact.description.content}} />
        {contactForm}
      </div>
    )
  }
}
