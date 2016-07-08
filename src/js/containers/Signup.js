import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { loginSelector } from '../selectors/loginSelector'

import { setModule } from '../actions/modules'
import {
  setDocumentTitleIfNeeded,
  setDocumentDescription,
} from '../actions/common'

class Signup extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    // set module
    dispatch(setModule('user'))
    // set document title
    dispatch(setDocumentTitleIfNeeded('Sign up page'))
    // set document description
    dispatch(setDocumentDescription('Phiroom\'s registration page'))
    // return empty promises array
    return []
  }
  
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }


  render() {
    // injected by connect call
    const {
      user,
    } = this.props

    //console.log('signup', this.props)

    let message = 'Sorry, signing up is not allowed...'

    if (this.props.user.is_authenticated) {
      message = `You are already connected as ${this.props.user.username}`
    }

    return (
      <section role="main">
        <article>
          <h1>Sign up</h1>
          <p>{message}</p>
        </article>
      </section>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(loginSelector)(Signup)
