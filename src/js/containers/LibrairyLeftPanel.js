import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { librairyLeftPanelSelector } from '../selectors/librairyLeftPanelSelector'

import { Link } from 'react-router'

import LibrairyLeftPanelLibrairy from '../components/LibrairyLeftPanelLibrairy'
import LibrairyLeftPanelCollections from '../components/LibrairyLeftPanelCollections'
import LibrairyLeftPanelPosts from '../components/LibrairyLeftPanelPosts'
import LibrairyLeftPanelPortfolios from '../components/LibrairyLeftPanelPortfolios'
import LibrairyImportButton from '../components/LibrairyImportButton'

class LibrairyLeftPanel extends Component {

  render() {
    // injected by connect() call:
    const {
      dispatch,
      portfolioHeaders,
    } = this.props
    
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
            portfolios={this.props.portfolioHeaders}
            drag={this.props.drag}
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

// Wrap the component to inject dispatch and state into it
export default connect(librairyLeftPanelSelector)(LibrairyLeftPanel)

