import React, { Component, PropTypes } from 'react'

import AuthenticatedContactForm from './AuthenticatedContactForm'
import AnonymousContactForm from './AnonymousContactForm'

import { fetchDescriptionIfNeeded } from '../actions/contact'

export default class Contact extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    promises.push(dispatch(fetchDescriptionIfNeeded()))
    return promises  
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  render() {
    let contactForm
    // if (this.props.user.is_authenticated) {
    //  contactForm = AuthenticatedContactForm
    // } else {
        contactForm = (<AnonymousContactForm />)
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
