import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class NotFound extends Component {

  render() {
    return (
      <article id="not-found">
        <h1>404</h1>
        <h2>Sorry, the ressource you are waiting for couln't be found…</h2>
        <p><Link to={"/"}>Go to home page</Link></p>
      </article>
    )
  }
}
