import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class WeblogPostNavigation extends Component {
  render() {
    let previous = ''
    let next = ''
    if (this.props.previous) {
      previous = (<Link id="prev"
          to={`/weblog/${this.props.previous}/`}>« Previous post</Link>)
    }
    if (this.props.next) {
      next = (<Link id="next"
          to={`/weblog/${this.props.next}/`}>Next post »</Link>)
    }

    return (
        <nav id="pagination">
          {previous}{next}
        </nav>
    )
  }
}
