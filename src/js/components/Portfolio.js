import React, { Component, PropTypes } from 'react'


export default class Portfolio extends Component {
  render() {
    return React.cloneElement(this.props.children, {
      portfolio: this.props.portfolio,
      dispatch: this.props.dispatch,
      modules: this.props.modules,
    })
  } 
}

