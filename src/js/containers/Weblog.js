import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { setModule } from '../actions/modules'

class Weblog extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    // set module
    dispatch(setModule('weblog'))
    return []
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
  }


  render() {
    // injected by connect() call:
    const { dispatch } = this.props

    return this.props.children
  }
}

export default connect()(Weblog)
