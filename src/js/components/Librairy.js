import React, { Component, PropTypes } from 'react'

import { setModule } from '../actions/modules'

export default class Librairy extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []

    // fetch portfolios headers if user is_staff
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

  render() {
    return (
        <section role="main">
          <nav id="left-panel">
            <h6>Collections</h6>
            <h6>Posts</h6>
            <h6>Portfolios</h6>
          </nav>
        </section>
    )
  }
}
