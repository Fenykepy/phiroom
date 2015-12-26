import React, { Component, PropTypes } from 'react'

import { setModule } from '../actions/modules'

export default class Weblog extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    if (! clientSide) {
      // set module
      dispatch(setModule('weblog'))
    }
    return []
  }


  componentDidMount() {
    // set module
    if (this.props.modules.current != 'weblog') {
      this.props.dispatch(setModule('weblog'))
    }
  }


  render() {
    return React.cloneElement(this.props.children, {weblog: this.props.weblog,
                              dispatch: this.props.dispatch,
                              modules: this.props.modules,
                              viewport: this.props.viewport
    })
  }
}
