import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyLeftPanelLibrairy extends Component {

  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6>Librairy</h6>
          <ul>
            <li><Link to="/librairy/all/">All pictures</Link></li>
            {/*<li><Link>Quick collection</Link></li>
            <li><Link>Last importation</Link></li>*/}
          </ul>
        </div>
      )
    }
    return null
  }
}

