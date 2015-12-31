import React, { Component, PropTypes } from 'react'

import { logout } from '../actions/user'

export default class Logout extends Component {
  
  componentWillMount() {
    // logout user
    this.props.dispatch(logout())
    // redirect to home page
    this.props.history.pushState(null, '/')
  }


  render() {
    return (<div/>)
  }
}
