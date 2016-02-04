import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'

import { librairySelector } from '../selectors/librairySelector'

import { Link } from 'react-router'
import LibrairyLeftPanel from '../containers/LibrairyLeftPanel'

import { setModule } from '../actions/modules'
import { dragEnd } from '../actions/librairy'
import { fetchPortfoliosHeadersIfNeeded } from '../actions/portfolios'


class Librairy extends Component {

  static fetchData(dispatch, params=null, clientSide=false) {
    let promises = []
    // fetch portfolios headers
    dispatch(fetchPortfoliosHeadersIfNeeded())
    // fetch posts headers if user is weblog_author
    // fetch collections headers
    // set module
    dispatch(setModule('librairy'))
    
    return promises
  }

  componentDidMount() {
    this.constructor.fetchData(this.props.dispatch, null, true)

    // listen for dragEnd events
    document.addEventListener('dragend', this.handleDragEnd.bind(this))
  }

  componentWillUnmount() {
    document.removeEventListener('dragend', this.handleDragEnd)
  }

  handleDragEnd() {
    this.props.dispatch(dragEnd())
  }


  render() {
    // injected by connect call:
    const { 
      dispatch,
      user,
      drag
    } = this.props
    //console.log('lib', this.props)
    return (
        <section role="main">
          <LibrairyLeftPanel
            user={this.props.user}
            drag={this.props.drag}
          />
          {this.props.children}
        </section>
    )
  }
}


export default connect(librairySelector)(Librairy)
