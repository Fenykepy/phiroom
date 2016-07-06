import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { loginSelector } from '../selectors/loginSelector'

import LoginForm from '../components/LoginForm'
import Spinner from '../components/Spinner'

import { login } from '../actions/user'
import { setModule } from '../actions/modules'
import { setDocumentTitleIfNeeded } from '../actions/common'

class Login extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    // set module
    dispatch(setModule('user'))
    // set document title
    dispatch(setDocumentTitleIfNeeded('Login page'))
    // return empty promises array
    return []
  }
  
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }

  componentWillReceiveProps(nextProps) {
    // redirect if user is authenticated
    if (nextProps.user.is_authenticated) {
      // redirect to target page if we have a next
      if (this.props.location.query.next) {
        this.context.router.push(this.props.location.query.next)
      } else {
        // redirect to home page
        // TODO redirect to profil page when it's done
        this.context.router.push('/')
      }
    }
  }

  handleLogin(credentials) {
    this.props.dispatch(login(credentials))
      .then(() => {
        // if we have a redirection go to it
        //console.log('login',this.props)
        if (this.props.location.query.next) {
          this.context.router.push(this.props.location.query.next)
        }
      })
      .catch(error =>
        console.log(error)
      )
  }
  
  render() {
    // injected by connect call
    const {
      dispatch,
      user,
      csrf,
    } = this.props

    //console.log('Login', this.props, this.context)

    if (this.props.user.is_fetching_token) {
      return <Spinner message="Signing in..." />
    }
    
    return (
      <section role="main">
        <article>
          <h1>Sign in</h1>
          <LoginForm
            id="loginForm"
            csrf={this.props.csrf}
            handleSubmit={this.handleLogin.bind(this)}
            errors={this.props.user.errors}
          />
        </article>
      </section>
    )
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

// Wrap the component to inject dispatch and state into it
export default connect(loginSelector)(Login)
