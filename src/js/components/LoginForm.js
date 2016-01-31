import React, { Component, PropTypes } from 'react'

import { base_url } from '../config'


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
    return (
      <form 
        action={`${base_url}api/token-auth/`}
        method="post"
        encType='application/json'
        onSubmit={this.handleSubmit.bind(this)}
      >
      <p><span className="red">*</span> : required fields.</p>
        {/* csrf protection */}
        <input type='hidden'
               name='csrfmiddlewaretoken'
               value={this.props.csrf}
        />
        <div className="field_wrapper">
          <label htmlFor="id_username">Username:<span className="red"> *</span></label>
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
          <input id="id_password"
                 name="password"
                 type="password"
                 value={this.state.password}
                 maxLength="254"
                 onChange={this.handlePasswordChange.bind(this)}
                 required
          />
        </div>
        <div className="centered">
          <input type="submit"
                 value="Sign in"
          />
        </div>
      </form>
    )

  }
}
