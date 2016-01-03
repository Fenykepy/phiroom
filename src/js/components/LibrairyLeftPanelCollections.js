import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyLeftPanelCollections extends Component {

  render() {
    if (this.props.user.is_librairy_member) {
      return (
        <div>
          <h6>Collections</h6>
          <ul>
            <li><Link to="/librairy/collections/">A collection</Link></li>
          </ul>
        </div>
      )
    }
    return null
  }
}
