import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { portfolioSelector } from '../selectors/portfolioSelector'
import { setModule } from '../actions/modules'

class Portfolio extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    // set module
    dispatch(setModule('portfolios'))
    return []
  }

  goToDefaultPortfolioIfNeeded(props) {
    if ((! props.params.slug || props.params.slug == 'undefined') &&
        props.defaultPortfolio) {
      this.context.router.push(`/portfolio/${props.defaultPortfolio}/`)
    }
  }
  
  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    this.goToDefaultPortfolioIfNeeded(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    this.goToDefaultPortfolioIfNeeded(nextProps)
  }


  render() {
    // injected by connect call:
    const {
      dispatch,
      defaultPortfolio,
    } = this.props

    return this.props.children
  } 
}

Portfolio.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default connect(portfolioSelector)(Portfolio)
