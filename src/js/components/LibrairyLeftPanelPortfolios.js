import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'

export default class LibrairyLeftPanelPortfolios extends Component {

  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6>Portfolios</h6>
          <ul>
            {this.props.portfolios.map((port) => 
              <li key={port.slug}>
                <Link to={`/librairy/portfolios/${port.slug}`}
                      activeClassName="selected"
                >{port.title}</Link>
              </li>
            )}
          </ul>
        </div>
      )
    }
    return null
  }
}
