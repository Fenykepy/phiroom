import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import LibrairyLeftPanelLibrairy from './LibrairyLeftPanelLibrairy'
import LibrairyLeftPanelCollections from './LibrairyLeftPanelCollections'
import LibrairyLeftPanelPosts from './LibrairyLeftPanelPosts'
import LibrairyLeftPanelPortfolios from './LibrairyLeftPanelPortfolios'
import LibrairyImportButton from './LibrairyImportButton'

export default class LibrairyLeftPanel extends Component {

  render() {
    return (
        <nav id="left-panel">
          <LibrairyLeftPanelLibrairy
            user={this.props.user}
          />
          <LibrairyLeftPanelCollections
            user={this.props.user}
          />
          <LibrairyLeftPanelPosts
            user={this.props.user}
          />
          <LibrairyLeftPanelPortfolios
            user={this.props.user}
            portfolios={this.props.portfolio.headers}
            drag={this.props.librairy.drag}
            dispatch={this.props.dispatch}
          />
          <LibrairyImportButton
            user={this.props.user}
            dispatch={this.props.dispatch}
          />
        </nav>
    )
  }
}


