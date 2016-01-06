import React, { Component, PropTypes } from 'react'

import LibrairyLeftPanelPortfolioItem from './LibrairyLeftPanelPortfolioItem'


export default class LibrairyLeftPanelPortfolios extends Component {
  
  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6>Portfolios</h6>
          <ul>
            {this.props.portfolios.map((port) => 
              <LibrairyLeftPanelPortfolioItem
                key={port.slug}
                {...port}
              />
            )}
          </ul>
        </div>
      )
    }
    return null
  }
}
