import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class ErrorPage extends Component {

  getErrorMessage(status) {
    switch(status) {
        case 403:
            return "Sorry, you have no right to access to this ressource..."
        case 404:
            return "Sorry, the ressource you are waiting for couldn't be found..."
        case 418:
            return "I'm a tea pot..."
        default:
            return "Sorry, an error occured..."
    }
  }

  render() {
    let status = this.props.status || 404
    return (
      <article id="error-page">
        <h1>{status}</h1>
        <h2>{this.getErrorMessage(status)}</h2>
        <p><Link to={"/"}>Go to home page</Link></p>
      </article>
    )
  }
}
