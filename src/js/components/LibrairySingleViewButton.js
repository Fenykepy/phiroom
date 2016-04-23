import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class extends Component {

  render() {
    console.log(this.props.selected_list)
    let picture
    if (this.props.selected_list[0]) {
      picture = this.props.selected_list[0]
    } else if (this.props.pictures[0]) {
      picture = this.props.pictures[0].pk
    }
    if (picture) {
      return (
        <button
            className="single-view"
            title="Open single view"
        >
          <Link to={`${this.props.pathname}single/${picture}/`}><span className="accessibility">Single view</span>
          </Link>
        </button>
      )
    }
    return null
  }
}
