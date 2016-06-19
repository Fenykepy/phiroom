import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class Footer extends Component {

  getLinks() {
    if (this.props.user.is_authenticated) {
      return (
          <Link to='/logout/'>Sign out</Link>
      )
    } else {
      return (
        <Link
          to={'/login/?next=' + this.props.location.pathname}
          title="Sign in with existing account"
        >Sign in</Link>
      )
    }
  }
  /*
  getUsername() {
    if (this.props.user.is_authenticated) {
      // TODO Add dropdown menu to display user info here
      return(
        <Link
          to='/profil/'
          title="Edit your profile"
        >Profile</Link>
      )
    }
    return(
      <Link
        to='/signup/'
        title="Create an account"
      >Sign up</Link>
    )
  }
  */
  render () {
    //console.log('footer', this.props)
    return (
        <footer role="contentinfo">
          <p id="powered"><a target="_blank" href="http://phiroom.org">Powered by Phiroom</a> | {this.getLinks()}</p>
        </footer>
    )
  }
}
