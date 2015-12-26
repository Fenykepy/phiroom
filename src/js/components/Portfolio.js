import React, { Component, PropTypes } from 'react'

import { setModule } from '../actions/modules'

export default class Portfolio extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    if (! clientSide) {
      // set module
      dispatch(setModule('portfolios'))
    }
    return []
  }

  goToDefaultPortfolioIfNeeded(props) {
    if ((! props.params.slug || props.params.slug == 'undefined') &&
        props.portfolio.default) {
      props.history.pushState(null, `/portfolio/${props.portfolio.default}/`)
    }
  }
  
  componentDidMount() {
    // set module
    if (this.props.modules.current != 'portfolios') {
      this.props.dispatch(setModule('portfolios'))
    }
    this.goToDefaultPortfolioIfNeeded(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    this.goToDefaultPortfolioIfNeeded(nextProps)
  }


  render() {
    return React.cloneElement(this.props.children, {
      portfolio: this.props.portfolio,
      dispatch: this.props.dispatch,
      modules: this.props.modules,
      viewport: this.props.viewport,
    })
  } 
}

