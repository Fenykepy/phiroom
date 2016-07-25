import React, { Component, PropTypes } from 'react'

import settings from '../config'

import { Link } from 'react-router'

import FormFieldErrors from './FormFieldErrors'
import FormRequiredFields from './FormRequiredFields'

let base_url = settings.base_url

export default class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value})
  }

  handlePasswordChange(e) {
    this.setState({password: e.target.value})
  }

  handleSubmit(e) {
    e.preventDefault()
    this.props.handleSubmit(this.state)
  }

  render() {
    //console.log('LoginForm', this.props)
    return (
      <form 
        action={`${base_url}api/token-auth/`}
        method="post"
        encType='application/json'
        onSubmit={this.handleSubmit.bind(this)}
      >
        <FormRequiredFields />
        <div className="field_wrapper">
          <FormFieldErrors
            errors_list={this.props.errors}
            field={'non_field_errors'}
          />
        </div>
        {/* csrf protection */}
        <FormFieldErrors
          errors_list={this.props.errors}
          field={'csrfmiddlewaretoken'}
        />
        <input type='hidden'
               name='csrfmiddlewaretoken'
               default_value={this.props.csrf}
        />
        <div className="field_wrapper">
          <label htmlFor="id_username">Username:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.errors}
            field={'username'}
          />
          <input id="id_username"
                 name="username"
                 type="text"
                 value={this.state.username}
                 maxLength="254"
                 onChange={this.handleUsernameChange.bind(this)}
                 required
          />
        </div>
        <div className="field_wrapper">
          <label htmlFor="id_password">Password:<span className="red"> *</span></label>
          <FormFieldErrors
            errors_list={this.props.errors}
            field={'password'}
          />
          <input id="id_password"
                 name="password"
                 type="password"
                 value={this.state.password}
                 maxLength="254"
                 onChange={this.handlePasswordChange.bind(this)}
                 required
          />
        </div>
        <div>No account yet ? <Link
            to="/signup/"
          >Sign up</Link></div>

        
        <div className="centered">
          <input type="submit"
                 value="Sign in"
          />
        </div>
      </form>
    )

  }
}
