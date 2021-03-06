import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyGridViewButton extends Component {
  render() {
    //console.log('librairy grid view button', this.props)
    
    return (
      <Link to={this.props.pathname.split('single')[0]}>
        <button
          className="grid-view"
          title="Back to grid view"
        >
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div className="visual"></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
          <span className="accessibility">Grid view</span>
        </button>
      </Link>
    )
  }
}
