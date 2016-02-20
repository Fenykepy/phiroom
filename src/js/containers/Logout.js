import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { logout } from '../actions/user'

class Logout extends Component {
  
  componentWillMount() {
    const { dispatch } = this.props
    // logout user
    this.props.dispatch(logout())
    // redirect to home page
    this.context.router.push('/login/')
  }


  render() {
    return (<div/>)
  }
}

Logout.contextTypes = {
  router: React.PropTypes.object.isRequired,
}


export default connect()(Logout)
