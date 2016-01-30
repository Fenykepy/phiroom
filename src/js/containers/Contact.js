import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { contactDescriptionSelector } from '../selectors/contactDescriptionSelector'

import ContactMessage from '../containers/ContactMessage'

import Spinner from '../components/Spinner'

import { fetchDescriptionIfNeeded } from '../actions/contact'
import { setModule } from '../actions/modules'


class Contact extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // get description
    promises.push(dispatch(fetchDescriptionIfNeeded()))
    // set module
    dispatch(setModule('contact'))

    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  getDescription() {
    let desc = this.props.description
    if (! desc || desc.is_fetching) {
      // show a spinner
      return (<Spinner message="Fetching..." />)
    }
    return (
      <article>
        <h1>{desc.title}</h1>
        <span dangerouslySetInnerHTML={{__html: desc.content}} />
      </article>
    )
  }

  render() {
    // injected by connect() call:
    const {
      dispatch,
      description,
    } = this.props

    return (
      <section role="main">
        {this.getDescription()}
        <hr />
        {/* insert follow links here */}
        <article>
          <h1>Leave me a message</h1>
          <ContactMessage
            user={this.props.user}
            csrf={this.props.common.csrfToken.token}
          />
        </article>
      </section>
    )

  }
}


// Wrap the component to inject dispatch and state into it
export default connect(contactDescriptionSelector)(Contact)
