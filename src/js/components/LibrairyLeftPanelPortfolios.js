import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'

import { 
  addPicts2Portfolio,
  dragEnd
} from '../actions/librairy'

import PortfolioEditionButton from './PortfolioEditionButton'
import LibrairyLeftPanelPortfolioItem from './LibrairyLeftPanelPortfolioItem'


export default class LibrairyLeftPanelPortfolios extends Component {

  handleDrop(portfolio) {
    if (! this.props.drag.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPicts2Portfolio(portfolio, picture))
    })
  }
  
  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6>Portfolios
            <PortfolioEditionButton
              className="plus"
              dispatch={this.props.dispatch}
            />
          </h6>
          <ul>
            {this.props.portfolios.map(port => 
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
