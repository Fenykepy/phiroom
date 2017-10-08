import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { setModule } from '../actions/modules'
import { setDocumentTitleIfNeeded } from '../actions/common'

import { settingsSelector } from '../selectors/settingsSelector'

import ErrorPage from '../components/ErrorPage'

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
    const {
      dispatch,
      activate_weblog,
    } = this.props

    if (! this.props.activate_weblog) {
      // if weblog is deactivated, we send 404
      return (
        <ErrorPage
          status={404}
        />
      )
      
    }


    return this.props.children
  }
}

export default connect(settingsSelector)(Weblog)
