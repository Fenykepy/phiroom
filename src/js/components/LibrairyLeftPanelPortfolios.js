import React, { Component, PropTypes } from 'react'

import { addPicts2Portfolio } from '../actions/librairy'

import LibrairyLeftPanelPortfolioItem from './LibrairyLeftPanelPortfolioItem'


export default class LibrairyLeftPanelPortfolios extends Component {

  handleDrop(portfolio) {
    this.props.dispatch(addPicts2Portfolio(portfolio))
  }
  
  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6>Portfolios</h6>
          <ul>
            {this.props.portfolios.map((port) => 
              <LibrairyLeftPanelPortfolioItem
                key={port.slug}
                handleDrop={this.handleDrop.bind(this)}
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
