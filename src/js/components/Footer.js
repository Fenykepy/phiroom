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
          <Link to={'/login/?next=' + this.props.location.pathname}>Sign in</Link>
      )
    }
  }

  render () {
    //console.log('footer', this.props)
    return (
        <footer role="contentinfo">
          <p id="powered"><a target="_blank" href="http://phiroom.org">Powered by Phiroom</a> | {this.getLinks()}</p>
        </footer>
    )
  }
}
