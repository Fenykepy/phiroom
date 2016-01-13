import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import LibrairyLeftPanel from './LibrairyLeftPanel'

import { setModule } from '../actions/modules'
import { dragEnd } from '../actions/librairy'
import { fetchPortfoliosHeadersIfNeeded } from '../actions/portfolios'

import { fetchCSRFTokenIfNeeded } from '../actions/common'


export default class Librairy extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // fetch csrf token
    promises.push(dispatch(fetchCSRFTokenIfNeeded()))
    // fetch portfolios headers
    dispatch(fetchPortfoliosHeadersIfNeeded())
    // fetch posts headers if user is weblog_author
    // fetch collections headers
    if (! clientSide) {
      // set module
      dispatch(setModule('librairy'))
    }
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)
    // set module
    if (this.props.modules.current != 'librairy') {
      this.props.dispatch(setModule('librairy'))
    }

    // listen for dragEnd events
    document.addEventListener('dragend', this.handleDragEnd.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener('dragend', this.handleDragEnd)
  }

  handleDragEnd() {
    this.props.dispatch(dragEnd())
  }

  getChildren() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        dispatch: this.props.dispatch,
        viewport: this.props.viewport,
        librairy: this.props.librairy,
      })
    }
    return null
  }

  render() {
    //console.log('lib', this.props)
    return (
        <section role="main">
          <LibrairyLeftPanel {...this.props}/>
          {this.getChildren()}
        </section>
    )
  }
}
