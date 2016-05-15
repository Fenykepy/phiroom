import React, { Component, PropTypes } from 'react'

import { PICTURE } from '../constants/dragTypes'

import { 
  addPict2Portfolio,
  dragEnd
} from '../actions/librairy'

import PortfolioEditionButton from './PortfolioEditionButton'
import LibrairyLeftPanelPortfolioItem from './LibrairyLeftPanelPortfolioItem'


export default class LibrairyLeftPanelPortfolios extends Component {

  constructor(props) {
    super(props)

    this.state = {
      show: true,
    }
  }

  handleDrop(portfolio) {
    if (! this.props.drag.type == PICTURE) {
      return this.props.dispatch(dragEnd())
    }
    this.props.drag.data.map(picture => {
      this.props.dispatch(addPict2Portfolio(portfolio, picture))
    })
  }
  
  handleClick() {
    this.setState({show: ! this.state.show})
  }

  render() {
    if (this.props.user.is_staff) {
      return (
        <div>
          <h6><span
            onClick={this.handleClick.bind(this)}
          >Portfolios</span>
            <PortfolioEditionButton
              className="plus"
              dispatch={this.props.dispatch}
            />
          </h6>
          <ul
            style={{display: this.state.show ? "block" : "none"}}
          >
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
