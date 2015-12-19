import React, { Component, PropTypes } from 'react'


export default class Weblog extends Component {
  render() {
    return React.cloneElement(this.props.children, {weblog: this.props.weblog, dispatch: this.props.dispatch, modules: this.props.modules})
  }
}
