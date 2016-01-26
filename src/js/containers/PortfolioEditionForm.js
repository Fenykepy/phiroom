import React, { Component, Proptypes } from 'react'

import { connect } from 'react-redux'

import { portfolioEditionSelector } from '../selectors/portfolioEditionSelector'

import {
  portfolioSetTitle,
  portfolioSetDraft,
  portfolioSetPubdate,
  portfolioSetOrder,
} from '../actions/portfolios'


class PortfolioEditionForm extends Component {
  render() {
    // injected by connect() call:
    const {
      dispatch,
      edited, 
    } = this.props

    return (
      <div />
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default connect(portfolioEditionSelector)(PortfolioEditionForm)
