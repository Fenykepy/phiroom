import React, { Component, PropTypes } from 'react'

import { Link } from 'react-router'
import LibrairyLeftPanel from './LibrairyLeftPanel'

import { setModule } from '../actions/modules'
import { fetchPortfoliosHeadersIfNeeded } from '../actions/portfolios'

export default class Librairy extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
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
  }

  getChildren() {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        viewport: this.props.viewport
      })
    }
    return null
  }

  render() {
    console.log(this.props)
    return (
        <section role="main">
          <LibrairyLeftPanel {...this.props}/>
          {this.getChildren()}
        </section>
    )
  }
}
