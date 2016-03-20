import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { setModule } from '../actions/modules'
import { setDocumentTitleIfNeeded } from '../actions/title'

class Weblog extends Component {

  static fetchData(dispatch, params, clientSide=false) {
    // set module
    dispatch(setModule('weblog'))
    // set document title
    dispatch(setDocumentTitleIfNeeded())
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
