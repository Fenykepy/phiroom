import React, { Component, PropTypes } from 'react'

import LoginForm from './LoginForm'

import { login } from '../actions/user'
import { fetchCSRFTokenIfNeeded } from '../actions/common'
import { setModule } from '../actions/modules'

export default class Login extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // get csrfToken
    promises.push(dispatch(fetchCSRFTokenIfNeeded()))
    if (! clientSide) {
      // set module
      dispatch(setModule('user'))
    }

    return promises
  }
  
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    // set module
    if (this.props.modules.current != 'user') {
      this.props.dispatch(setModule('user'))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.is_authenticated) {
        // redirect to home page
        this.props.history.pushState(null, '/')
    }
  }

  handleLogin(credentials) {
    this.props.dispatch(login(credentials)).then(() => {
      // if we have a redirection go to it
      console.log('login',this.props)
      if (this.props.user.redirect) {
        this.props.history.pushState(null, redirect)
      }
    })
  }
  
  render() {
    return (
      <section role="main">
        <h1>Login</h1>
      {/*<div id="overlay"></div>*/}
        <LoginForm
         id="loginForm"
         csrf={this.props.common.csrfToken.token}
         handleSubmit={this.handleLogin.bind(this)}
        />
      </section>
    )
  }
}
