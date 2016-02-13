import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { loginSelector } from '../selectors/loginSelector'

import LoginForm from '../components/LoginForm'

import { login } from '../actions/user'
import { fetchCSRFTokenIfNeeded } from '../actions/common'
import { setModule } from '../actions/modules'

class Login extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    // set module
    dispatch(setModule('user'))
  }
  
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
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
      if (this.props.location.query.next) {
        this.props.history.pushState(null, this.props.location.query.next)
      }
    })
  }
  
  render() {
    // injected by connect call
    const {
      dispatch,
      user,
      csrf,
    } = this.props

    console.log('login', this.props)
    
    return (
      <section role="main">
        <h1>Login</h1>
      {/*<div id="overlay"></div>*/}
        <LoginForm
         id="loginForm"
         csrf={this.props.csrf}
         handleSubmit={this.handleLogin.bind(this)}
        />
      </section>
    )
  }
}



// Wrap the component to inject dispatch and state into it
export default connect(loginSelector)(Login)
